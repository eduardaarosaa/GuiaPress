const { Sequelize } = require("sequelize");

//Criando variavel de conexão com o banco de dados
const connection = new Sequelize(
    "guiapress", "root", "", {
        host:'localhost',
        dialect:'mysql',
        timezone: "-03:00"
    }
);

module.exports = connection;