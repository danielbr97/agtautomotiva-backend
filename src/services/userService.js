const db = require('../database');
const bcrypt = require('bcryptjs');

const createUser = async (first_name, last_name, email, password, access_level) => {
    const userDuplicated = await db.query('SELECT id FROM users WHERE email = $1;', [email]);

    if (userDuplicated.rowCount > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
    
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(password, saltRounds);
    const sql = 'INSERT INTO users (first_name, last_name, email, password, full_name, access_level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    await db.query(sql, [first_name, last_name, email, senhaHash, (first_name + ' ' + last_name), access_level]);
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
    const sql = 'UPDATE users SET password = $1 WHERE email = $2';
    await db.query(sql, [senhaHash, email]);
}

const updateUser = async (first_name, last_name, email, newemail, access_level) => {

    if(newemail){
        const userDuplicated = await db.query('SELECT id, first_name, last_name FROM users WHERE email = $1;', [newemail]);

        if (userDuplicated.rowCount > 0) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }
    }
    
    const sql = `
        UPDATE users 
        SET 
            first_name = COALESCE($1, first_name), 
            last_name = COALESCE($2, last_name),
            email = COALESCE($3, email),
            access_level COALESCE($4, access_level)
        WHERE email = $5
    `;
    await db.query(sql, [first_name, last_name, newemail, access_level, email ]);
}

module.exports = {
    createUser,
    changePassword,
    updateUser
}