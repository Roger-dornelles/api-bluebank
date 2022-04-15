const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();


const server = express();
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({extended:true}));
server.use(express.static(path.join(__dirname, '../public')));
server.use('/',routes);
server.use((req,res) => {
  res.status(404);
  res.json({error:'Endpoint não encontrado.'});
});

server.listen(process.env.PG_PORT ,() => {
  console.log('Funcionando em ',process.env.HOST);
});