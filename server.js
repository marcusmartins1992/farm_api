require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const farmRoutes = require('./src/controllers/FarmController');
const farmerRoutes = require('./src/controllers/FarmerController');
const productionRoutes = require('./src/controllers/ProductionController');
const userRoutes = require('./src/controllers/UserController');
const authRoutes = require('./src/controllers/AuthController');

const swaggerDocument = require('./src/doc/swagger.json');
const swaggerUI = require('swagger-ui-express');

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });

const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));


server.use(
    '/api-docs',
    swaggerUI.serve, 
    swaggerUI.setup(swaggerDocument)
  );


// Rota para as operações CRUD das fazendas
server.use('/farm', farmRoutes);

// Rota para as operações CRUD dos fazendeiros
server.use('/farmer', farmerRoutes);

// Rota para as operações CRUD da produção de leite
server.use('/production', productionRoutes);

// Rota para as operações CRUD de users
server.use('/user', userRoutes);

// Rota para as operações de auth
server.use('/auth', authRoutes);

server.listen(process.env.PORT, ()=>{
    console.log(` - Rodando no endereço: ${process.env.BASE}`);
});