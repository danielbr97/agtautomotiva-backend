const db = require('../database');

const listar = async (id, legal_name, trade_name, cnpj, phone, email, parts_category) => {

    let querySupplier = `
        SELECT
        id,
        legal_name,
        trade_name,
        cnpj,
        email,
        parts_category,
        postal_code, 
        street, 
        number_address, 
        complement, 
        neighborhood, 
        city, 
        state, 
        country
        FROM suppliers
        WHERE 1=1
    `;

    const valores = [];
    if (id) {
        valores.push(id);
        querySupplier += ` AND id = $${valores.length}`;
    }
    if (legal_name) {
        valores.push(legal_name);
        querySupplier += ` AND legal_name = $${valores.length}`;
    }
    if (trade_name) {
        valores.push(trade_name);
        querySupplier += ` AND trade_name = $${valores.length}`;
    }
    if (cnpj) {
        valores.push(cnpj);
        querySupplier += ` AND cnpj = $${valores.length}`;
    }
    if (phone) {
        valores.push(phone);
        querySupplier += ` AND phone = $${valores.length}`;
    }
    if (email) {
        valores.push(email);
        querySupplier += ` AND email = $${valores.length}`;
    }
    if (parts_category) {
        valores.push(parts_category);
        querySupplier += ` AND parts_category = $${valores.length}`;
    }

    const resultado = await db.query(querySupplier, valores);

    if(resultado.rowCount <= 0){
        throw new Error('SUPPLIER_NOT_FOUND');
    }

    return resultado;
};

const criar = async (legal_name, trade_name, cnpj, phone, email, parts_category, postal_code, street, number_address, complement , neighborhood, city, state, country) => {

    const supplierCnpjExists = db.query(`
        SELECT 
        id,
        trade_name,
        legal_name
        FROM suppliers
        WHERE cnpj = $1;
    `, [cnpj]);
    
    if (supplierCnpjExists.rowCount > 0) {
        const errorHandled = new Error('SUPPLIER_ALREADY_EXISTS');
        errorHandled.id = supplierCnpjExists.rows[0].id;
        errorHandled.trade_name = supplierCnpjExists.rows[0].trade_name;
        errorHandled.legal_name = supplierCnpjExists.rows[0].legal_name;
        throw errorHandled;
    }

    const sql = `
    INSERT INTO suppliers (
    legal_name, 
    trade_name, 
    cnpj, 
    phone, 
    email, 
    parts_category, 
    postal_code, 
    street, 
    number_address, 
    complement, 
    neighborhood, 
    city, 
    state, 
    country
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`;
    await db.query(sql, [legal_name, trade_name, cnpj, phone, email, parts_category, postal_code, street, number_address, complement , neighborhood, city, state, country]);
};

const atualizarSupplier = async (legal_name, trade_name, cnpj, phone, email, parts_category) => {

    const sql = `
        UPDATE supplier 
        SET
        legal_name = COALESCE($1, legal_name), 
        trade_name = COALESCE($2, trade_name),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        parts_category = COALESCE($5, parts_category)
        WHERE cnpj = $6;
    `;

    await db.query(sql, [legal_name, trade_name, phone, email, parts_category, cnpj]);
}

const atualizarSupplierAddress = async (cnpj, postal_code, street, number_address, complement , neighborhood, city, state, country) => {

    const sql = `
        UPDATE supplier 
        SET
        postal_code = COALESCE($1, postal_code), 
        street = COALESCE($2, street),
        number_address = COALESCE($3, number_address),
        complement = COALESCE($4, complement),
        neighborhood = COALESCE($5, neighborhood),
        city = COALESCE($6, city),
        state = COALESCE($7, state),
        country = COALESCE($8, country),
        WHERE cnpj = $9;
    `;

    await db.query(sql, [postal_code, street, number_address, complement , neighborhood, city, state, country, cnpj]);
}

const deletar = async (id) =>{

    const resultado = await db.query('DELETE FROM supliers WHERE id = $1 RETURNING id;', [id]);

    if (resultado.rowCount === 0) {
        throw new Error('SUPPLIER_NOT_FOUND');
    }
}


module.exports = {
    listar,
    criar,
    atualizarSupplier,
    atualizarSupplierAddress,
    deletar
};