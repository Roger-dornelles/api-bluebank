const {Sequelize}  = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_BASE_URI,
  {
    dialect:'postgres',
    port: process.env.PG_PORT,
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false
      }
    }
  }
);

const connection = async () => {
  try{
    await sequelize.authenticate();
    console.log('conexão ao banco de dados funcionando');
  }catch(error){
    console.log('Ocorreu um erro: ',error.message);
  }
}
connection();

module.exports = sequelize;

