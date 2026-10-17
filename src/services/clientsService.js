const db = require('../database');

const listar = async (id, cpf_cnpj, email, phone) => {

    const queryClient = `
        SELECT
        c.id AS client_id,
        c.name AS client_name,
        c.cpf_cnpj AS client_cpf_cnpj,
        c.phone AS client_phone,
        c.email AS client_email,
        v.plate AS vehicle_plate,
        v.model AS vehicle_model,
        v.id AS vehicle_id
        FROM clients c
        INNER JOIN vehicles v ON v.client_id = c.id;
    `;

    if(id){
        queryClient += ' AND id = '+id;
    }
    if(cpf_cnpj){
        if(queryClient.includes('WHERE')) queryClient += ' AND cpf_cnpj = '+cpf_cnpj;
        else queryClient += ' WHERE cpf_cnpj = '+cpf_cnpj;
    }
    if(email){
        if(queryClient.includes('WHERE')) queryClient += ' AND email = '+email;
        else queryClient += ' WHERE email = '+email;
    }
    if(phone){
        if(queryClient.includes('WHERE')) queryClient += ' AND phone = '+phone;
        else queryClient += ' WHERE phone = '+phone;
    }

    const resultado = await db.query(queryClient);

    if(resultado.rowCount <= 0){
        throw new Error('CLIENT_NOT_FOUND');
    }

    const clientsMap = {};
    resultado.rows.forEach(linha => {

        if (!clientsMap[linha.client_id]) {
            clientsMap[linha.client_id] = {
                id: linha.client_id,
                name: linha.client_name,
                cpf_cnpj: linha.client_cpf_cnpj,
                phone: linha.client_phone,
                vehicles: []
            };
        }

        if (linha.vehicle_id) {
            clientsMap[linha.client_id].vehicles.push({
                id: linha.vehicle_id,
                model: linha.vehicle_model,
                plate: linha.vehicle_plate
            });
        }
    });

    return Object.values(clientsMap);
};

const criar = async (name, email, phone, cpf_cnpj) => {

    const clientExistente = await db.query('SELECT id FROM clients WHERE cpf_cnpj = $1;', [cpf_cnpj]);
    
    if (clientExistente.rowCount > 0) {
        throw new Error('CLIENT_ALREADY_EXISTS');
    }

    const sql = 'INSERT INTO clients (name, email, phone, cpf_cnpj) VALUES ($1, $2, $3, $4) RETURNING *;';
    await db.query(sql, [name, email, phone, cpf_cnpj]);
};

const atualizar = async (name, email, phone, cpf_cnpj) => {
    const clientExistente = await db.query('SELECT id FROM clients WHERE cpf_cnpj != $1 AND email = $2;', [cpf_cnpj, email]);
    
    if (clientExistente.rowCount > 0) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const sql = 'UPDATE clients SET name = $1, email = $2, phone = $3 WHERE cpf_cnpj = $4;';
    const resultado = await db.query(sql, [name, email, phone, cpf_cnpj]);
    
    return resultado.rows[0];
}

const deletar = async (id) =>{

    const resultado = await db.query('DELETE FROM clients WHERE id = $1 RETURNING id;', [id]);

    if (resultado.rowCount === 0) {
        throw new Error('CLIENT_NOT_FOUND');
    }
}


module.exports = {
    listar,
    criar,
    atualizar,
    deletar
};