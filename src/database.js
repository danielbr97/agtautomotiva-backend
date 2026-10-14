const { Pool } = require('pg');
require('dotenv').config();

// Configura o Pool usando a URL de conexão do Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Obrigatório para conexões seguras com o Neon
  }
});

// Função auxiliar para executar queries e evitar repetir código
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

module.exports = { 
  query 
};