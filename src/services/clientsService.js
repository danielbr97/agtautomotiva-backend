const db = require('../database');

const listar = async (id, cpf_cnpj, email, phone, name) => {

    let queryClient = `
        SELECT
        c.id AS client_id,
        c.name AS client_name,
        c.cpf_cnpj AS client_cpf_cnpj,
        c.phone AS client_phone,
        c.email AS client_email,
        c.postal_code AS client_postal_code,
        c.street AS client_street,
        c.number_address AS client_number_address,
        c.complement AS client_complement,
        c.neighborhood AS client_neighborhood,
        c.city AS client_city,
        c.state AS client_state,
        c.country AS client_country,
        v.plate AS vehicle_plate,
        v.model AS vehicle_model,
        v.id AS vehicle_id
        FROM clients c
        FULL JOIN vehicles v ON v.client_id = c.id
        WHERE 1=1
    `;

    const valores = [];
    if (id) {
        valores.push(id);
        queryClient += ` AND c.id = $${valores.length}`;
    }
    if (cpf_cnpj) {
        valores.push(cpf_cnpj);
        queryClient += ` AND c.cpf_cnpj = $${valores.length}`;
    }
    if (name) {
        valores.push(`%${name}%`);
        queryClient += ` AND c.name ILIKE $${valores.length}`;
    }
    if (email) {
        valores.push(email);
        queryClient += ` AND c.email = $${valores.length}`;
    }
    if (phone) {
        valores.push(phone);
        queryClient += ` AND c.phone = $${valores.length}`;
    }

    const resultado = await db.query(queryClient, valores);

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
                postal_code: linha.client_postal_code,
                street: linha.client_street,
                number_address: linha.client_number_address,
                complement: linha.client_complement,
                neighborhood: linha.client_neighborhood,
                city: linha.client_city,
                state: linha.client_state,
                country: linha.client_country,
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

const criar = async (name, email, phone, cpf_cnpj, postal_code, street, number_address, complement , neighborhood, city, state, country) => {

    const cnpjcpfExistente = await db.query('SELECT id FROM clients WHERE cpf_cnpj = $1;', [cpf_cnpj]);
    if (cnpjcpfExistente.rowCount > 0) {
        throw new Error('CLIENT_CPFNPJ_ALREADY_EXISTS');
    }

    const emailxistente = await db.query('SELECT id FROM clients WHERE email = $1;', [email]);
    if (emailxistente.rowCount > 0) {
        throw new Error('CLIENT_EMAIL_ALREADY_EXISTS');
    }

    const sql = `
        INSERT INTO clients (
        name, 
        email, 
        phone, 
        cpf_cnpj, 
        name, 
        email, 
        phone, 
        cpf_cnpj, 
        postal_code, 
        street, 
        number_address, 
        complement, 
        neighborhood, 
        city, 
        state, 
        country
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;
    `;
    await db.query(sql, [name, email, phone, cpf_cnpj, postal_code, street, number_address, complement , neighborhood, city, state, country]);
};

const atualizarCliente = async (name, email, phone, cpf_cnpj) => {

    if(!email){
        const clientExistente = await db.query('SELECT id FROM clients WHERE cpf_cnpj != $1 AND email = $2;', [cpf_cnpj, email]);
    
        if (clientExistente.rowCount > 0) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
    }

    const sql = `
        UPDATE clients 
        SET 
            name = COALESCE($1, name), 
            email = COALESCE($2, email), 
            phone = COALESCE($3, phone)
        WHERE cpf_cnpj = $4;
    `;
    await db.query(sql, [name, email, phone, cpf_cnpj]);
};

const atualizarEndereco = async (postal_code, street, number_address, complement , neighborhood, city, state, country, cpf_cnpj) => {

    const sql = `
        UPDATE clients 
        SET 
            postal_code = COALESCE($1, postal_code), 
            street = COALESCE($2, street), 
            number_address = COALESCE($3, number_address),
            complement = COALESCE($5, complement),
            neighborhood = COALESCE($6, neighborhood),
            city = COALESCE($7, city),
            state = COALESCE($8, state),
            country = COALESCE($9, country)
        WHERE cpf_cnpj = $10;
    `;
    await db.query(sql, [postal_code, street, number_address, complement , neighborhood, city, state, country, cpf_cnpj]);
};

const deletar = async (id) =>{

    const resultado = await db.query('DELETE FROM clients WHERE id = $1 RETURNING id;', [id]);

    if (resultado.rowCount === 0) {
        throw new Error('CLIENT_NOT_FOUND');
    }
};


module.exports = {
    listar,
    criar,
    atualizarCliente,
    atualizarEndereco,
    deletar
};