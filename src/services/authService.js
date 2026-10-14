const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

const login = async (username, password) => {

    // Consulta ao banco de dados de usuários a ser feita
    if (username === 'daniboy' && password === '86765674') {
        const payload = { id: 1, user: 'admin' };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        return { autenticated: true, token };
    }else{
        throw new Error('USER_PASSWORD_INVALID');
    }
    
}

module.exports = { 
    login
};