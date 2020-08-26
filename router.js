let express = require("express");
let router = express.Router();
const twig = require("twig");
const livreModel = require("./models/livre.modele");
const mongoose = require("mongoose");


router.get("/", (requete, reponse) => {
    console.log("Page d'accueil GET sur /");
    reponse.render("accueil.html.twig");
})

router.get("/livres", (requete, reponse) => {
    livreModel.find()
    .exec()
    .then(livres => {
        reponse.render("livres/liste.html.twig",{livres : livres, message: reponse.locals.message});
    })
    .catch(error => {
        console.log(error);
    });
    
})

router.post("/livres", (requete, reponse) => {
    livre = new livreModel({
        _id : new mongoose.Types.ObjectId(),
        nom : requete.body.titre,
        auteur: requete.body.auteur,
        pages: requete.body.nbPages,
        description: requete.body.description
    })
    livre.save()
    .then(resultat =>{
        console.log(resultat);
        reponse.redirect("/livres");
    })
    .catch(error =>{
        console.log(error);
    })
})

router.get("/livres/:id", (requete, reponse) => {
    //console.log(requete.params.id);
    livreModel.findById(requete.params.id)
    .exec()
    .then(livre => {
        reponse.render("livres/show.html.twig", {livre:livre})
    })
    .catch(error => {
        console.log(error);
    });

    
    //reponse.render("livres/show.html.twig",{});
})

router.post("/livres/delete/:id", (requete, reponse) => {
    livreModel.remove({_id:requete.params.id})
    .exec()
    .then(resultat => {
        requete.session.message = {
            type : 'success',
            contenu : 'Supression de ce livre'
        }
        reponse.redirect("/livres");
    })
    .catch(error => {
        console.log(error);
    })
});

router.use((requete,reponse, suite)=>{
    const error = new Error("Page Non trouvée");
    error.status = 404;
    suite(error);
})

router.use((error,requete,reponse)=>{
    reponse.status(error.status || 500);
    reponse.end(error.message);
})

module.exports = router;