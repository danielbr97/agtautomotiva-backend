const userService = require('../services/userService');

const createUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if(!first_name || !last_name || !email || !password){
        return res.status(400).json({ error: 'Nome, Sobrenome, Email e Senha são obrigatórios'});
    }

    try {
        const newUser = await userService.createUser(first_name, last_name, email, password);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Erro em userController.createUser:", error);

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ error: 'Este e-mail já está cadastrado' });
        }

        return res.status(500).json({ error: 'Erro interno ao salvar usuário' });
    }
}

const changePassword = async (req, res) => {
    const { email, password, newpassword } = req.body;

    if(!email || !password || !newpassword){
        return res.status(400).json({ error: 'Email, Senha e Nova Senha são obrigatórios'});
    }

    try {
        const newUser = await userService.changePassword(email, password, newpassword);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Erro em userController.changePassword:", error);

        if(error.message === 'USER_NOT_FOUND' || error.message === 'USER_PASSWORD_INVALID'){
            return res.status(404).json({ error: 'Usuário ou senha incorreto.'});
        }

        return res.status(500).json({ error: 'Erro interno ao salvar usuário' });
    }
}

const updateUser = async (req, res) => {
    const { first_name, last_name, email, newemail } = req.body;

    if(!email){
        return res.status(400).json({ error: 'E-mail é obrigatório'});
    }else if(!first_name && !last_name && !newemail){
        return res.status(400).json({ error: 'Primeiro Nome ou Sobrenome ou Novo E-mail precisa estar preenchido'});
    }

    try {
        const newUser = await userService.updateUser(first_name, last_name, email, newemail);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Erro em userController.createUser:", error);

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ error: 'Este e-mail já está cadastrado' });
        }

        return res.status(500).json({ error: 'Erro interno ao salvar usuário' });
    }
}

module.exports = {
    createUser,
    changePassword,
    updateUser
}