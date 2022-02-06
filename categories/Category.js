const Sequelize = require("sequelize");

const connection = requere("../database/database");

const Category = connection.define('categories',{
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },slug:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Category;