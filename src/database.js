const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

async function query(text, params) {
    const start = Date.now();
    try {
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		console.log('Query executada com sucesso:', { text, duration, rows: res.rowCount });
		return res;
	} catch (error) {
		console.error('Erro na query SQL:', error);
		throw error;
	}
}

async function connect() {
	const start = Date.now();
	try {
		const client = await pool.connect();
		const duration = Date.now() - start;
		console.log(`Conexão exclusiva adquirida com sucesso (${duration}ms)`);
		return client;
	} catch (error) {
		console.error('Erro ao tentar conectar ao banco Neon:', error);
		throw error;
	}
}

module.exports = { 
  	query,
	connect
};
