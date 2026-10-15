const jwt = require('jsonwebtoken');
const db = require('../database');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.JWT_SECRET;

const login = async (email, password) => {

    const user = await db.query('SELECT id, password FROM users WHERE email = $1;', [email]);

    if (!user) {
        throw new Error('USER_PASSWORD_INVALID');
    }

    const senhaValida = await bcrypt.compare(password, user.password);

    if (!senhaValida) {
        throw new Error('USER_PASSWORD_INVALID');
    }

    const payload = { id: user.id, user: 'admin' };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return { autenticated: true, token };
}

module.exports = { 
    login
};