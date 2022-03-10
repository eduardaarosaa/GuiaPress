const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Articles");
const slugify = require("slugify");

router.get("/admin/articles", (req,res)=>{
    Article.findAll().then(articles => {
        res.render("admin/articles/index", {articles: articles});
    })
});

router.get("/admin/articles/new", (req,res)=>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    })
  
});

router.post("/article/save", (req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug:slugify(title),
        body:body,
        categoryId:category
    }).then(()=> {
        res.redirect("/admin/articles");
    })
});

router.post("/articles/delete", (req,res) => {
    var id = req.body.id;

    if(id != undefined){

        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id:id
                  }   
              }).then(() => {
                  res.redirect("/admin/articles")
              });

        }else{//NÃO for um número
            res.redirect("/admin/articles");
        }
    }else{//NULL
        res.redirect("/admin/articles");
    }
});

router.post("/articles/update", (req, res) => {
    console.log('ROUTE UPDATE');
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title:title, slug: slugify(title), body:body , category:category}, {
        where:{
            id:id
        }
    }).then(() => {
    
        res.redirect("/admin/articles");
    })
});

router.get("/admin/articles/edit/:id", (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/articles");
    }
  
    //Pesquisar algo pelo ID - rapido
    Article.findByPk(id).then(article => {
        if(article != undefined){

            Category.findAll().then(categories => {
                 res.render("admin/articles/edit", {article:article, categories:categories});
            });

        }else{
            console.log('else');
            res.redirect("/admin/articles");
        }
    }).catch(erro => {
        console.log('erro');
        res.redirect("/admin/articles");
    })
});

router.get("/articles/page/:num", (req,res) => {
     var page = req.params.num;
     var offeset = 0; 

     if(isNaN(page) || page == 1){
         offeset = 0;
     }else{
         offeset = (parseInt(page) * 2);
         console.log(offeset);
     }
     Article.findAndCountAll({
         limit: 2,
         offeset: offeset,
         order:[[
            'id','DESC'
           ]]
     }).then(
         articles => {
             var next; 
             if(offeset + 2 >= articles.count){
                next = false; //Significa que atingimos a quantidade máxima de artigos
             }else{
                 next = true;
             }
             var result = {
                 page: parseInt(page),
                 next:next,
                 articles : articles
             }
             Category.findAll().then(categories => {
                    res.render("admin/articles/page", {
                        result:result,
                        categories:categories
                    })
             });

            //  res.json(result);
         }
     ); //Quantidade de artigos e todos os artigos.
});

module.exports = router ;
