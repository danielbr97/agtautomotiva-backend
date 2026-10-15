const authService = require('../services/authService');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await authService.login(email, password);
        
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erro em authController.login: ", error);

        if(error.message === "USER_PASSWORD_INVALID"){
            return res.status(401).json({ error: 'Usuário ou senha incorreto.' });
        }

        return res.status(500).json({ error: 'Erro interno ao logar.' });
    }
};

module.exports = { 
    login
};