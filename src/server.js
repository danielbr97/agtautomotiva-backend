const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clientsRoutes = require('./routes/clientsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/clients', clientsRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/quote', quoteRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
