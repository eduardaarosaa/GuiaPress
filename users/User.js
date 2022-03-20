const Sequelize = require("sequelize");

const connection = require("../database/database");

const User = connection.define('users',{
    mail:{
        type:Sequelize.STRING,
        allowNull:false
    },password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

User.sync({force: false});

module.exports = User;