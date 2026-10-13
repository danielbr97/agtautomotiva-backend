const clientsService = require('../services/clientsService');

// Controller chamando Service listar clientes
const listar = async (req, res) => {
    try {
        const clients = await clientsService.listar();
        return res.json(clients);
    } catch (error) {
        console.error("Erro em clientsContrller.listar:", error);
        return res.status(500).json({ erro: 'Erro interno ao buscar clientes' });
    }
};

// Controller chamando Service criar cliente
const criar = async (req, res) => {
    const { nome, email, phone, cpf_cnpj } = req.body; // Pega os dados enviados pelo Front-end
    
    if (!nome || !email || !phone || !cpf_cnpj) {
        return res.status(400).json({ erro: 'Nome, email, CPF/CNPJ e telefone são obrigatórios' });
    }

    try {
        const resultado = await clientsService.criar(sql, [nome, email, phone, cpf_cnpj]);
        res.status(201).json(resultado.rows[0]); // Retorna o cliente criado
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao salvar cliente no banco' });
    }


    try {
        // Passa os dados limpos para o serviço tratar
        const newClient = await clientsService.criar(nome, email, phone, cpf_cnpj);
        return res.status(201).json(newClient);
    } catch (error) {
        console.error("Erro em usuariosController.criar:", error);

        // Trata o erro de negócio específico disparado pelo Service
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
        }

        return res.status(500).json({ erro: 'Erro interno ao salvar usuário' });
    }
};

// Controller chamando deletar cliente
const deletar = async (req, res) =>{
    const { id } = req.params; // Pega o ID da URL
    
    try {
        const resultado = await clientsService.query(id);

        if (resultado == 'cliente não encontrado') {
            return res.status(404).json({ erro: 'cliente não encontrado' });
        }

        res.json({ mensagem: `Cliente ${id} deletado com sucesso!` });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar cliente' });
    }
}

// Exportamos as funções como um objeto para a Route usar
module.exports = {
    listar,
    criar,
    deletar
};
