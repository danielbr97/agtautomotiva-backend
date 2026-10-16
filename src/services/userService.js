const db = require('../database');
const bcrypt = require('bcryptjs');

const createUser = async (first_name, last_name, email, password) => {

    const user = await db.query('SELECT id FROM users WHERE email = $1;', [email]);

    if (user.rowCount > 0) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }
    
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(password, saltRounds);
    const sql = 'INSERT INTO users (first_name, last_name, email, password, full_name) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
    const resultado = await db.query(sql, [first_name, last_name, email, senhaHash, (first_name + ' ' + last_name)]);

    return resultado.rows[0];
}

const changePassword = async (email, password, newpassword) => {
    const user = await db.query('SELECT id, password FROM users WHERE email = $1;', [email]);

    if (user.rowCount <= 0) {
        throw new Error('USER_NOT_FOUND');
    }

    const senhaValida = await bcrypt.compare(password, user.rows[0].password);

    if (!senhaValida) {
        throw new Error('USER_PASSWORD_INVALID');
    }

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(newpassword, saltRounds);
    const sql = 'UPDATE users SET password = $1 WHERE id = $2';
    const resultado = await db.query(sql, [senhaHash, user.rows[0].id]);

    return resultado.rows[0];
}

const updateUser = async (first_name, last_name, email, newemail) => {
    const userDuplicated = await db.query('SELECT id FROM users WHERE email = $1;', [newemail]);

    if (userDuplicated.rowCount > 0) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const sql = 'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE email = $4';
    const resultado = await db.query(sql, [first_name, last_name, newemail, email]);

    return resultado.rows[0];
}

module.exports= {
    createUser,
    changePassword,
    updateUser
}