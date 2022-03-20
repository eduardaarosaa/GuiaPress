//Importar o express
const bodyParser = require("body-parser");
const express = require("express");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController =  require("./users/UsersController");

const Article = require("./articles/Articles");
const Category = require("./categories/Category");
const User = require("./users/User");

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
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

//Criar um rota principal 
app.get("/", (req, res) => {
   Article.findAll({
       order:[[
        'id','DESC'
       ]],
       limit: 2
   }).then(articles => {
       Category.findAll().then(categories => {
        res.render("index", {articles:articles, categories:categories});
       })
   });
});

app.get("/artigo/:slug", (req, res) => {
    console.log(req.params.slug);
    var slug = req.params.slug;
    // var slug = 'Mysql-ou-NoSQL-Qual-o-melhor';
  
    console.log("oiiii");
    console.log(req.params.slug , 'AQUIIII');

    Article.findOne({
        where:{
            slug:slug
        }

    }).then(article => {
        console.log(article , "Linha 61");
        if(article != undefined){
            console.log("Entrou no IF");
            Category.findAll().then(categories => {
                res.render("article", {article:article, categories:categories});
               })

       }else{
           console.log("Else");
           res.render("/");
       }
    }).catch(err => {
        console.log("Error");
        res.render("/");
    });
});

app.get("/category/:slug", (req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}] // é um join
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles:category.articles , categories:categories});
            });

        }else{
          
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/"); 
    })
})

 //Inicialziando a aplicação

 app.listen(8080                                                                                                                                                                                                                         , () =>{
     console.log("O Servidor está rodando!!!");
 });
