const userService = require('../services/userService');

const createUser = async (req, res) => {
    const { first_name, last_name, email, password, access_level } = req.body;

    if(!first_name || !last_name || !email || !password || !access_level){
        return res.status(400).json({ success: false, message: 'Nome, Sobrenome, Email e Senha são obrigatórios'});
    }

    try {
        await userService.createUser(first_name, last_name, email, password, access_level);
        return res.status(201).json({ success: true, message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error("Erro em userController.createUser:", error);

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao criar usuário' });
    }
}

const changePassword = async (req, res) => {
    const { email, password, newpassword } = req.body;

    if(!email || !password || !newpassword){
        return res.status(400).json({ success: false, message: 'Email, Senha e Nova Senha são obrigatórios'});
    }

    try {
        await userService.changePassword(email, password, newpassword);
        return res.status(201).json({ success: true, message: 'Senha alterada com sucesso'});
    } catch (error) {
        console.error("Erro em userController.changePassword:", error);

        if(error.message === 'USER_NOT_FOUND' || error.message === 'USER_PASSWORD_INVALID'){
            return res.status(404).json({success: false, message: 'Usuário ou senha incorreto.'});
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao alterar senha do usuário' });
    }
}

const updateUser = async (req, res) => {
    const { first_name, last_name, email, newemail, access_level } = req.body;

    if(!email){
        return res.status(400).json({ success: false, message: 'E-mail é obrigatório'});
    }else if(!first_name && !last_name && !newemail && !access_level){
        return res.status(400).json({ success: false, message: 'Primeiro Nome ou Sobrenome ou Novo E-mail ou Nível de Acesso precisa estar preenchido'});
    }

    try {
        await userService.updateUser(first_name, last_name, email, newemail, access_level);
        return res.status(201).json({ success: true, message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error("Erro em userController.updateUser:", error);

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao atualizar usuário' });
    }
}

module.exports = {
    createUser,
    changePassword,
    updateUser
}