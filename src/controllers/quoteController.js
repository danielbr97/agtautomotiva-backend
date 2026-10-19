const quoteService = require('../services/quoteService');

const listar = async (req, res) => {
    const { status, id, client_cpf_cnpj, client_name, vehicle_plate } = req.query; 
    try {
        const quotes = await quoteService.listar(status, id, client_cpf_cnpj, client_name, vehicle_plate);
        return res.json(quotes);
    } catch (error) {
        console.error("Erro em quoteController.listar:", error);

        if(error.message == 'QUOTE_NOT_FOUND'){
            return res.status(404).json({ success: false, message: "Cotação não encontrada"});
        }

        console.error("Erro em quoteController.listarTodos:", error);
        return res.status(500).json({ success: false, message: 'Erro interno ao buscar cotações' });
    }
};

const criar = async (req, res) => {
    const { date_quote, date_start, date_delivery, client_id, vehicle_id, user_id, items_quote, vehicle_current_kilometer, vehicle_gas_level } = req.body;
    
    if (!date_quote || !date_start || !date_delivery || !client_id || !vehicle_id || !user_id || !items_quote || !vehicle_current_kilometer || !vehicle_gas_level) {
        return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchido' });
    }

    try {
        await quoteService.criar(date_quote, date_start, date_delivery, client_id, vehicle_id, user_id, items_quote, vehicle_current_kilometer, vehicle_gas_level);
        return res.status(201).json({ success: true, message: 'Cotação criada com sucesso'});
    } catch (error) {
        console.error("Erro em quoteController.criar:", error);

        if(error.message == 'RECORD_RELATED_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Registro relacionado não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao salvar cotação' });
    }
};

const atualizarStatus = async (req, res) => {
    const { id, status } = req.body;
    
    if (!id || !status) {
        return res.status(400).json({ success: false, message: 'Id e Status são obrigatórios' });
    }

    try {
        await quoteService.atualizarStatus(id, status);
        return res.status(201).json({ success: true, message: 'Cotação atualizada com sucesso'});
    } catch (error) {
        console.error("Erro em quoteController.atualizarStatus:", error);

        if(error.message == 'QUOTE_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Cotação não encontrada' });
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao atualizar cotação' });
    }
};

const deletar = async (req, res) =>{
    const { id } = req.query; 
    
    try {
        await quoteService.deletar(id);
        res.json({ success: true, message: 'Cotação deletada com sucesso' });
    } catch (error) {
        console.error("Erro em quoteController.deletar:", error);

        if (error.message == 'QUOTE_NOT_FOUND') {
            return res.status(404).json({ sucess: false, message: 'Cotação não encontrada' });
        }

        res.status(500).json({ erro: 'Erro ao deletar cotação' });
    }
};

module.exports = {
    listar,
    criar,
    deletar,
    atualizarStatus
};
