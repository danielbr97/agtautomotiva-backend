const db = require('../database');

const listar = async (status, id, client_cpf_cnpj, client_name, vehicle_plate) => {

    let queryquote = `
        SELECT 
        q.id AS quote_id,
        q.date_quote AS quote_date_quote,
        q.date_start AS quote_date_start,
        q.date_delivery AS quote_date_delivery,
        q.status AS quote_status,
        q.client_name AS quote_client_name,
        q.client_cpf_cnpj AS quote_client_cpf_cnpj,
        q.client_phone AS quote_client_phone,
        q.client_email AS quote_client_email,
        q.vehicle_plate AS quote_vehicle_plate,
        q.vehicle_model AS quote_vehicle_model,
        q.user_name AS quote_user_name,
        q.client_id AS quote_client_id,
        q.vehicle_id AS quote_vehicle_id,
        q.user_id AS quote_user_id,
        i.id AS items_quote_id,
        i.description AS items_quote_description,
        i.amount AS items_quote_amount,
        i.total_value AS items_quote_total_value,
        i.unit_value AS items_quote_unit_value,
        i.type AS items_quote_type
        FROM quotes q
        FULL JOIN items_quote i ON i.quote_id = q.id
        WHERE 1=1
    `;

    const valores = [];

    if (status) {
        valores.push(status);
        queryquote += ` AND q.status = $${valores.length}`;
    }
    if (id) {
        valores.push(id);
        queryquote += ` AND q.id = $${valores.length}`;
    }
    if (client_cpf_cnpj) {
        valores.push(client_cpf_cnpj);
        queryquote += ` AND q.client_cpf_cnpj = $${valores.length}`;
    }
    if (client_name) {
        valores.push(`%${client_name}%`);
        queryquote += ` AND q.client_name ILIKE $${valores.length}`;
    }
    if (vehicle_plate) {
        valores.push(vehicle_plate);
        queryquote += ` AND q.vehicle_plate = $${valores.length}`;
    }

    const resultado = await db.query(queryquote, valores);

    if(resultado.rowCount <= 0){
        throw new Error('QUOTE_NOT_FOUND');
    }
    
    const quotesMap = {};
    resultado.rows.forEach(linha => {

        if (!quotesMap[linha.quote_id]) {
            quotesMap[linha.quote_id] = {
                id: linha.quote_id,
                date_quote: linha.quote_date_quote,
                date_start: linha.quote_date_start,
                date_delivery: linha.quote_date_delivery,
                status : linha.quote_status,
                client_name : linha.quote_client_name,
                client_cpf_cnpj : linha.quote_client_cpf_cnpj,
                client_phone : linha.quote_client_phone,
                client_email : linha.quote_client_email,
                vehicle_plate : linha.quote_vehicle_plate,
                vehicle_model : linha.quote_vehicle_model,
                user_name : linha.quote_user_name,
                client_id : linha.quote_client_id,
                vehicle_id : linha.quote_vehicle_id,
                user_id : linha.quote_user_id,
                items_quote: []
            };
        }

        if (linha.items_quote_id) {
            quotesMap[linha.quote_id].items_quote.push({
                id: linha.items_quote_id,
                description: linha.items_quote_description,
                amount: linha.items_quote_amount,
                total_value: linha.items_quote_total_value,
                unit_value: linha.items_quote_unit_value,
                type: linha.items_quote_type
            });
        }
    });

    return Object.values(quotesMap);
};

const criar = async (date_quote, date_start, date_delivery, client_id, vehicle_id, user_id, items_quote) => {
    
    const client = await db.query('SELECT name, cpf_cnpj, phone, email FROM clients WHERE id = $1',[client_id]);
    const vehicle = await db.query('SELECT plate, model FROM vehicles WHERE id = $1',[vehicle_id]);
    const user = await db.query('SELECT full_name FROM users WHERE id = $1',[user_id]);

    if (!client.rows[0] || !vehicle.rows[0] || !user.rows[0]) {
        throw new Error('RECORD_RELATED_NOT_FOUND');
    }

    const client_name = client.rows[0].name;
    const client_cpf_cnpj = client.rows[0].cpf_cnpj;
    const client_phone = client.rows[0].phone;
    const client_email = client.rows[0].email;
    const vehicle_plate = vehicle.rows[0].plate;
    const vehicle_model = vehicle.rows[0].model;
    const user_name = user.rows[0].full_name;

    const sqlQuote = `
        INSERT INTO quotes (
            date_quote, 
            date_start, 
            date_delivery, 
            client_id, 
            vehicle_id, 
            user_id,
            client_name, 
            client_cpf_cnpj, 
            client_phone, 
            client_email, 
            vehicle_plate, 
            vehicle_model, 
            user_name,
            status
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING *;
    `;
    const quoteResult = await db.query(sqlQuote, [
        date_quote, 
        date_start, 
        date_delivery, 
        client_id, 
        vehicle_id, 
        user_id,
        client_name, 
        client_cpf_cnpj, 
        client_phone, 
        client_email, 
        vehicle_plate, 
        vehicle_model,
        user_name,
        "Pendente"
    ]);

    items_quote.forEach(element => {
        element.quote_id = quoteResult.rows[0].id;
    });

    const valores = items_quote.flatMap(item => [
        item.description,
        item.amount,
        item.unit_value,
        item.total_value,
        item.type,
        item.quote_id
    ]);

    const marcadores = items_quote.map((_, index) => {
        const baseIndex = index * 6;
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}), $${baseIndex + 6})`;
    }).join(', ');

    const sqlItemsQuote = `
        INSERT INTO items_quote (description, amount, unit_value, total_value, type, quote_id) 
        VALUES ${marcadores} 
        RETURNING id
    `;
    
    await db.query(sqlItemsQuote, valores);
};

const deletar = async (id) =>{
    
    const resultado = await db.query('DELETE FROM quotes WHERE id = $1 RETURNING id;', [id]);

    if (resultado.rowCount === 0) {
        throw new Error('QUOTE_NOT_FOUND');
    }
};

module.exports = {
    listar,
    criar,
    deletar
};