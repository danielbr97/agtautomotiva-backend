const clientsService = require('../services/clientsService');

const listarTodos = async (req, res) => {
    try {
        const clients = await clientsService.listarTodos();
        console.log('clients -> ',clients);
        return res.json(clients);
    } catch (error) {
        console.error("Erro em clientsController.listar:", error);
        return res.status(500).json({ erro: 'Erro interno ao buscar clientes' });
    }
};

const criar = async (req, res) => {
    const { name, email, phone, cpf_cnpj } = req.body;
    
    if (!name || !email || !phone || !cpf_cnpj) {
        return res.status(400).json({ success: false, error: 'Nome, E-mail, CPF/CNPJ e Telefone são obrigatórios' });
    }

    try {
        await clientsService.criar(name, email, phone, cpf_cnpj);
        return res.status(201).json({success: true, message: 'Cliente criado com sucesso'});
    } catch (error) {
        console.error("Erro em clientsController.criar:", error);

        if (error.message === 'CLIENT_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, error: 'CNPJ/CPF já está cadastrado' });
        }

        return res.status(500).json({ success: false, error: 'Erro interno ao criar cliente' });
    }
};

const atualizar = async (req, res) => {
    const { name, email, phone, cpf_cnpj } = req.body;
    
    if (!name || !email || !phone || !cpf_cnpj) {
        return res.status(400).json({ success: false, error: 'Nome, E-mail, CPF/CNPJ e Telefone são obrigatórios' });
    }

    try {
        await clientsService.atualizar(name, email, phone, cpf_cnpj);
        return res.status(201).json({ success: true, message: 'Cliente atualizado com sucesso'});
    } catch (error) {
        console.error("Erro em clientsController.criar:", error);

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, error: 'Este e-mail já está cadastrado' });
        }

        return res.status(500).json({ success: false, error: 'Erro interno ao salvar cliente' });
    }
};

const deletar = async (req, res) =>{
    const { id } = req.params;
    
    try {
        await clientsService.deletar(id);
        res.json({ sucess: true, mensage: 'Cliente deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao deletar cliente' });
    }
};

module.exports = {
    listarTodos,
    criar,
    deletar,
    atualizar
};
