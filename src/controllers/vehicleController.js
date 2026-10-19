const vehicleService = require('../services/vehicleService');

const listar = async (req, res) => {
    const { id, plate, client_id, cpf_cnpj, email, chassi, manufacturer } = req.query;

    try {
        const vehicles = await vehicleService.listar(id, plate, client_id, cpf_cnpj, email, chassi, manufacturer);
        return res.json(vehicles);
    } catch (error) {
        console.error("Erro em vehicleController.listar:", error);

        if(error.message == 'VEHICLE_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Veículo não encontrado' });
        }

        return res.status(500).json({ erro: 'Erro interno ao buscar veículos' });
    }
};

const criar = async (req, res) => {
    const { plate, model, chassi, manufacturer, color, client_id } = req.body;
    
    if (!plate || !model || !chassi, !manufacturer || !color || !client_id) {
        return res.status(400).json({ success: false, message: 'Placa, Modelo, Chassi, Cor e Cliente são obrigatórios' });
    }

    try {
        await vehicleService.criar(plate, model, chassi, manufacturer, color, client_id);
        return res.status(201).json({success: true, message: 'Veículo criado com sucesso'});
    } catch (error) {
        console.error("Erro em vehicleController.criar:", error);

        if (error.message === 'PLATE_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Placa já está cadastrado', vehicle_id: error.vehicle_id, vehicle_client_name: error.vehicle_client_name});
        }

        if (error.message === 'CHASSI_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Chassi já está cadastrado', vehicle_id: error.vehicle_id, vehicle_client_name: error.vehicle_client_name});
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao criar veículo' });
    }
};

const atualizarVeiculo = async (req, res) => {
    const { plate, model, chassi, manufacturer, color, client_id} = req.body;
    
    if (!plate || !model || !chassi, !manufacturer || !color || !client_id) {
        return res.status(400).json({ success: false, message: 'Placa, Modelo, Chassi, Cor e Id do Cliente são obrigatórios' });
    }

    try {
        await vehicleService.atualizarVeiculo(plate, model, chassi, manufacturer, color, client_id);
        return res.status(201).json({ success: true, message: 'Veículo atualizado com sucesso'});
    } catch (error) {
        console.error("Erro em vehicleController.atualizarVeiculo:", error);

        if (error.message === 'PLATE_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Placa já está cadastrado', vehicle_id: error.vehicle_id, vehicle_client_name: error.vehicle_client_name});
        }

        if (error.message === 'CHASSI_ALREADY_EXISTS') {
            return res.status(409).json({ success: false, message: 'Chassi já está cadastrado', vehicle_id: error.vehicle_id, vehicle_client_name: error.vehicle_client_name});
        }

        return res.status(500).json({ success: false, message: 'Erro interno ao salvar cliente' });
    }
};

const atualizarCliente = async (req, res) => {
    const { plate, client_id } = req.body;
    
    if (!plate || !client_id) {
        return res.status(400).json({ success: false, message: 'Placa e Id do Cliente são obrigatórios' });
    }

    try {
        await vehicleService.atualizarCliente(plate, client_id);
        return res.status(201).json({ success: true, message: 'Veículo atualizado com sucesso'});
    } catch (error) {
        console.error("Erro em vehicleController.atualizarCliente:", error);

        return res.status(500).json({ success: false, message: 'Erro interno ao salvar cliente' });
    }
};

const deletar = async (req, res) =>{
    const { id } = req.query;

    try {
        await vehicleService.deletar(id);
        return res.json({ sucess: true, mensage: 'Veículo deletado com sucesso!' });
    } catch (error) {
        console.error("Erro em vehicleController.deletar:", error);

        if(error.message === 'CLIENT_NOT_FOUND'){
            return res.status(404).json({ success: false, message: 'Veículo não encontrado' });
        }

        return res.status(500).json({ success: false, message: 'Erro ao deletar veículo' });
    }
};

module.exports = {
    listar,
    criar,
    deletar,
    atualizarVeiculo,
    atualizarCliente
};
