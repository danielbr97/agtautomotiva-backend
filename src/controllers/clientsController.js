const clientsService = require('../services/clientsService');

const listar = async (req, res) => {
    const { id, cpf_cnpj, email, phone } = req.query;

    try {
        const clients = await clientsService.listar(id, cpf_cnpj, email, phone);
        return res.json(clients);
    } catch (error) {
        console.error("Erro em clientsController.listar:", error);

        if(error.message == 'CLIENT_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao buscar clientes' });
    }
};

const criar = async (req, res) => {
    const { name, email, phone, cpf_cnpj, postal_code, street, number_address, complement , neighborhood, city, state, country } = req.body;
    
    if (!name || !email || !phone || !cpf_cnpj) {
        return res.status(400).json({ success: false, message: 'Nome, E-mail, CPF/CNPJ e Telefone são obrigatórios' });
    }

    if(!postal_code || !street || !number_address || !neighborhood || !city || !state || !country){
        return res.status(400).json({ success: false, message: 'CEP, Estado, Cidade, Bairro, Rua e Número são obrigatórios' });
    }

    try {
        await clientsService.criar(name, email, phone, cpf_cnpj, postal_code, street, number_address, complement , neighborhood, city, state, country);
        return res.status(201).json({success: true, message: 'Cliente criado com sucesso'});
    } catch (error) {
        console.error("Erro em clientsController.criar:", error);

        if (error.message === 'CLIENT_CPFNPJ_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'CNPJ/CPF já está cadastrado' });
        }

        if (error.message === 'CLIENT_EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'E-mail já está cadastrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao criar cliente' });
    }
};

const atualizarCliente = async (req, res) => {
    const { name, email, phone, cpf_cnpj } = req.body;
    
    if (!cpf_cnpj) {
        return res.status(400).json({ success: false, message: 'CPF/CNPJ é obrigatório' });
    }else if(!name && !email && !phone){
        return res.status(400).json({ success: false, message: 'Nome ou E-mail ou Telefone precisa estar preenchido' });
    }

    try {
        await clientsService.atualizarCliente(name, email, phone, cpf_cnpj);
        return res.status(201).json({ success: true, message: 'Cliente atualizado com sucesso'});
    } catch (error) {
        console.error("Erro em clientsController.atualizarCliente:", error);

        if(error.message == 'CLIENT_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
        }

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao salvar cliente' });
    }
};

const atualizarEndereco = async (req, res) => {

    const { postal_code, street, number_address, complement , neighborhood, city, state, country, cpf_cnpj } = req.body;
    
    if (!cpf_cnpj) {
        return res.status(400).json({ success: false, message: 'CPF/CNPJ é obrigatório' });
    }

    if (!postal_code || !street || !number_address || !neighborhood || !city || !state || !country || !cpf_cnpj) {
        return res.status(400).json({ success: false, message: 'CEP, Estado, Cidade, Bairro, Rua e Número são obrigatórios' });
    }

    try {
        await clientsService.atualizarEndereco(postal_code, street, number_address, complement , neighborhood, city, state, country, cpf_cnpj);
        return res.status(201).json({ success: true, message: 'Endereço de cliente atualizado com sucesso'});
    } catch (error) {
        console.error("Erro em clientsController.atualizarEndereco:", error);

        if(error.message == 'CLIENT_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao salvar endereço do cliente' });
    }
}

const deletar = async (req, res) =>{
    const { id } = req.query;

    try {
        await clientsService.deletar(id);
        return res.json({ sucess: true, mensage: 'Cliente deletado com sucesso!' });
    } catch (error) {
        console.error("Erro em clientsController.deletar:", error);

        if(error.message === 'CLIENT_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao deletar cliente' });
    }
};

module.exports = {
    listar,
    criar,
    deletar,
    atualizarCliente,
    atualizarEndereco
};
