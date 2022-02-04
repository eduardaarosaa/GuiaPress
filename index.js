//Importar o express
const bodyParser = require("body-parser");
const express = require("express");
const connection = require("./database/database");

//Criar uma instancia do modulo express
const app = express(); 

//View Engine
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body parser 
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(bodyParser.json());

 //Database 

    connection
        .authenticate()
        .then(()=>{
            console.log("Conexão efetuada com sucesso!");
        }).catch((error) =>{
            console.log(error);
        })
//Criar um rota principal 
app.get("/", (req, res) => {
    res.render("index");
});

 //Inicialziando a aplicação

 app.listen(8080, () =>{
     console.log("O Servidor está rodando!!!");
 });
