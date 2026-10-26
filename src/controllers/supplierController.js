const supplierService = require('../services/supplierService');

const listar = async (req, res) => {
    const { id, legal_name, trade_name, cnpj, phone, email, parts_category, contact_name} = req.query;

    try {
        const vehicles = await supplierService.listar(id, legal_name, trade_name, cnpj, phone, email, parts_category, contact_name);
        return res.json(vehicles);
    } catch (error) {
        console.error("Erro em supplierController.listar:", error);

        if(error.message == 'SUPPLIER_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Fornecedor não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao buscar Fornecedores' });
    }
};

const criar = async (req, res) => {
    const { legal_name, trade_name, cnpj, phone, email, parts_category, postal_code, street, number_address, complement , neighborhood, city, state, country, contact_name } = req.body;
    
    if (!legal_name || !trade_name || !cnpj || !phone || !email || !parts_category || !postal_code || !street || !number_address || !neighborhood || !city || !state || !country || !contact_name) {
        return res.status(400).json({ success: false, message: 'Razão Social, Nome Fantasia, CNPJ, Telefone/Contato, E-mail, Categoria de Peças, Nome do Contato e Endereço são campos obrigatórios' });
    }

    try {
        await supplierService.criar(legal_name, trade_name, cnpj, phone, email, parts_category, postal_code, street, number_address, complement , neighborhood, city, state, country, contact_name);
        return res.status(201).json({success: true, message: 'Fornecedor criado com sucesso'});
    } catch (error) {
        console.error("Erro em supplierController.criar:", error);

        if (error.message === 'SUPPLIER_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Fornecedor já está cadastrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao criar fornecedor' });
    }
};

const atualizarSupplier = async (req, res) => {
    const { legal_name, trade_name, cnpj, phone, email, parts_category, contact_name } = req.body;
    
    if (!legal_name || !trade_name || !cnpj || !phone || !email || !parts_category || !contact_name) {
        return res.status(400).json({ success: false, message: 'Razão Social, Nome Fantasia, CNPJ, Telefone, E-mail, Nome do contato e Categoria de peças são campos obrigatórios' });
    }

    try {
        await supplierService.atualizarSupplier(legal_name, trade_name, cnpj, phone, email, parts_category, contact_name);
        return res.status(201).json({ success: true, message: 'Fornecedor atualizado com sucesso'});
    } catch (error) {
        console.error("Erro em supplierController.atualizarSupplier:", error);

        if(error.message === 'SUPPLIER_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Fornecedor não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao salvar fornecedor' });
    }
};

const atualizarSupplierAddress = async (req, res) => {
    const { cnpj, postal_code, street, number_address, complement , neighborhood, city, state, country } = req.body;
    
    if (!cnpj || !postal_code || !street || !number_address || !neighborhood || !city || !state || !country) {
        return res.status(400).json({ success: false, message: 'CEP, Rua, Número do endereço, Bairro, Cidade, Estado e País são campos obrigatórios' });
    }

    try {
        await supplierService.atualizarSupplierAddress(cnpj, postal_code, street, number_address, complement , neighborhood, city, state, country);
        return res.status(201).json({ success: true, message: 'Fornecedor atualizado com sucesso'});
    } catch (error) {
        console.error("Erro em supplierController.atualizarSupplierAddress:", error);

        if(error.message === 'SUPPLIER_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Fornecedor não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao salvar fornecedor' });
    }
};

const deletar = async (req, res) =>{
    const { id } = req.query;

    try {
        await supplierService.deletar(id);
        return res.json({ sucess: true, mensage: 'Fornecedor deletado com sucesso!' });
    } catch (error) {
        console.error("Erro em supplierController.deletar:", error);

        if(error.message === 'SUPPLIER_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Fornecedor não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao deletar fornecedor' });
    }
};

module.exports = {
    listar,
    criar,
    deletar,
    atualizarSupplier,
    atualizarSupplierAddress
};
