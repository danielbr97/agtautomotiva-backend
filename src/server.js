// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Importa o arquivo de rotas que criamos
const clientsRoutes = require('./routes/clientsRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // Essencial para o Express conseguir ler req.body

// 2. Vincula a rota ao Express com um prefixo
// Isso significa que todas as rotas dentro de clientsRoutes vão começar com /clients
app.use('/clients', clientsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
