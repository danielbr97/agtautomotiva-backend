const db = require('../database'); // Conexão com o Neon

const listar = async () => {
    const resultado = await db.query('SELECT * FROM clients ORDER BY id DESC;');
    return resultado.rows;
};

// Função para criar cliente
const criar = async (name, email, phone, cpf_cnpj) => {

    // Verificar se o e-mail já está cadastrado
    const clientExistente = await db.query('SELECT id FROM clients WHERE email = $1;', [email]);
    
    if (clientExistente.rowCount > 0) {
        // Dispara um erro específico caso o e-mail já exista no Neon
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // Se passou na validação, insere no banco
    const sql = 'INSERT INTO clients (name, email, phone, cpf_cnpj) VALUES ($1, $2, $3, $4) RETURNING *;';
    const resultado = await db.query(sql, [name, email, phone, cpf_cnpj]);
    
    return resultado.rows[0]; // Retorna apenas o objeto do cliente criado
};

// Função para deletar cliente
const deletar = async (id) =>{
    
    const sql = 'DELETE FROM clients WHERE id = \$1 RETURNING id;';
    const resultado = await db.query(sql, [id]);

    if (resultado.rowCount === 0) {
        return { erro: 'cliente não encontrado' };
    }

    return { mensagem: `Cliente ${id} deletado com sucesso!` };
}

// Exportamos as funções como um objeto para a Route usar
module.exports = {
    listar,
    criar,
    deletar
};