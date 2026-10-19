const db = require('../database');

const listar = async (id, plate, client_id, chassi, manufacturer) => {

    let queryVehicle = `
        SELECT
        plate,
        model,
        id,
        client_id,
        chassi,
        manufacturer,
        color
        FROM vehicles
        WHERE 1=1
    `;

    const valores = [];
    if (id) {
        valores.push(id);
        queryVehicle += ` v.id = $${valores.length}`;
    }
    if (plate) {
        valores.push(plate);
        queryVehicle += ` AND v.plate = $${valores.length}`;
    }
    if (chassi) {
        valores.push(chassi);
        queryVehicle += ` AND v.chassi = $${valores.length}`;
    }
    if (manufacturer) {
        valores.push(manufacturer);
        queryVehicle += ` AND v.manufacturer = $${valores.length}`;
    }
    if (client_id) {
        valores.push(client_id);
        queryVehicle += ` AND v.client_id = $${valores.length}`;
    }
    

    const resultado = await db.query(queryVehicle, valores);

    if(resultado.rowCount <= 0){
        throw new Error('VEHICLE_NOT_FOUND');
    }

    return resultado;
};

const criar = async (plate, model, chassi, manufacturer, color, client_id) => {

    const vehicleDb = await db.connect();

    const [vehiclePlateExists, vehicleChassiExists] = await Promise.all([
        vehicleDb.query(`
            SELECT 
            v.id AS vehicle_id,
            c.name AS client_name
            FROM vehicles v
            INNER JOIN clients c ON v.client_id = c.id
            WHERE plate = \$1;
        `, [plate]),
        vehicleDb.query(`
            SELECT 
            v.id AS vehicle_id,
            c.name AS client_name 
            FROM vehicles 
            WHERE chassi = \$1;
        `, [chassi])
    ]);
    
    if (vehiclePlateExists.rowCount > 0) {
        throw new Error('PLATE_ALREADY_EXISTS', { "vehicle_id": vehiclePlateExists.rows[0].vehicle_id, "vehicle_client_name": vehiclePlateExists.rows[0].client_name});
    }
    if (vehicleChassiExists.rowCount > 0) {
        throw new Error('PLATE_ALREADY_EXISTS', { "vehicle_id": vehicleChassiExists.rows[0].vehicle_id, "vehicle_client_name": vehicleChassiExists.rows[0].client_name});
    }

    const sql = `
    INSERT INTO vehicles (
    plate, 
    model, 
    chassi, 
    manufacturer, 
    color, 
    client_id
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    await db.query(sql, [plate, model, chassi, manufacturer, color, client_id]);
};

const atualizarVeiculo = async (plate, model, chassi, manufacturer, color) => {
    const vehicleDb = await db.connect();

    const [vehiclePlateExists, vehicleChassiExists] = await Promise.all([
        vehicleDb.query(`
            SELECT 
            v.id AS vehicle_id,
            v.plate AS vehicle_plate,
            v.manufacturer AS vehicle_manufacturer,
            v.model AS vehicle_model,
            c.name AS client_name
            FROM vehicles v
            INNER JOIN clients c ON v.client_id = c.id
            WHERE v.plate = \$1;
        `, [plate, client_id]),
        vehicleDb.query(`
            SELECT 
            v.id AS vehicle_id,
            v.plate AS vehicle_plate,
            v.manufacturer AS vehicle_manufacturer,
            v.model AS vehicle_model,
            c.name AS client_name
            FROM vehicles v
            INNER JOIN clients c ON v.client_id = c.id
            WHERE v.chassi = \$1;
        `, [plate, client_id]),
    ]);
    
    if (vehiclePlateExists.rowCount > 0) {
        throw new Error('PLATE_ALREADY_EXISTS', { 
            "vehicle_id": vehiclePlateExists.rows[0].vehicle_id, 
            "vehicle_client_name": vehiclePlateExists.rows[0].client_name,
            "vehicle_plate": vehiclePlateExists.rows[0].vehicle_plate,
            "vehicle_manufacturer": vehiclePlateExists.rows[0].vehicle_manufacturer,
            "vehicle_model": vehiclePlateExists.rows[0].vehicle_model,
        });
    }
    if (vehicleChassiExists.rowCount > 0) {
        throw new Error('PLATE_ALREADY_EXISTS', {
            "vehicle_id": vehicleChassiExists.rows[0].vehicle_id, 
            "vehicle_client_name": vehicleChassiExists.rows[0].client_name,
            "vehicle_plate": vehicleChassiExists.rows[0].vehicle_plate,
            "vehicle_manufacturer": vehicleChassiExists.rows[0].vehicle_manufacturer,
            "vehicle_model": vehicleChassiExists.rows[0].vehicle_model,
        });
    }

    const sql = `
        UPDATE vehicles 
        SET
        model = COALESCE($1, model), 
        chassi = COALESCE($2, chassi),
        manufacturer = COALESCE($3, manufacturer),
        color = COALESCE($4, color)
        WHERE plate = $5;
    `;

    await db.query(sql, [model, chassi, manufacturer, color, plate]);
}

const atualizarCliente = async (plate, client_id) => {
    const sql = `
        UPDATE vehicles 
        SET
        client_id = $1, 
        WHERE plate = $2;
    `;

    await db.query(sql, [plate, client_id]);
}

const deletar = async (id) =>{

    const resultado = await db.query('DELETE FROM vehicles WHERE id = $1 RETURNING id;', [id]);

    if (resultado.rowCount === 0) {
        throw new Error('VEHIECLE_NOT_FOUND');
    }
}


module.exports = {
    listar,
    criar,
    atualizarVeiculo,
    atualizarCliente,
    deletar
};