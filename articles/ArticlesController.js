const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Articles");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req,res)=>{
    Article.findAll().then(articles => {
        res.render("admin/articles/index", {articles: articles});
    })
});

router.get("/admin/articles/new", adminAuth, (req,res)=>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    })
  
});

router.post("/article/save", adminAuth, (req,res)=>{
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

router.post("/articles/delete", adminAuth, (req,res) => {
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

router.post("/articles/update", adminAuth, (req, res) => {
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

router.get("/admin/articles/edit/:id", adminAuth, (req,res) => {
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
    let offset = 1;
        if(!isNaN(page) && page > 0) {
            offset = parseInt(page);
        }
        Article.findAndCountAll({
            limit: 4,
            offset: (offset * 4) - 4
          }).then(articles => {
            let next = true;
            if((offset * 4) >= articles.count) {
               next = false;
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
