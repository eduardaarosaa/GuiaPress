const express = require("express");
const router = express.Router();

const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    res.send("Listagem de usuários");
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var mail = req.body.mail;
    var password = req.body.password;

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

    // res.json({mail, password}); //Exibir em json na tela os dados - enviados pelo form.  

});



module.exports = router;
