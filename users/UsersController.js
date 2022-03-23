const express = require("express");
const router = express.Router();

const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users =>{
        res.render("admin/users/index", {users: users});
        
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var mail = req.body.mail;
    var password = req.body.password;

    User.findOne({where:{mail:mail}}).then(user => {
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password,salt);
        
            User.create({
                mail:mail,
                password:hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            })
        }else{
            res.redirect("/admin/users/create");
        }
    });

    // res.json({mail, password}); //Exibir em json na tela os dados - enviados pelo form.  

});



module.exports = router;
