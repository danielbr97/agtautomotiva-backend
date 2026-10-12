const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Habilita o CORS para que seu Front-End (de qualquer link) possa acessar a API
app.use(cors()); 
app.use(express.json());

// O Render define a porta automaticamente na variável process.env.PORT
const PORT = process.env.PORT || 3000;

app.get('/usuarios', async (req, res) => {
    // Sua lógica de buscar no Neon aqui usando process.env.DATABASE_URL
    res.json({ mensagem: "Conectado com sucesso!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});