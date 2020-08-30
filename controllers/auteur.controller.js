const mongoose = require("mongoose");
const auteurModel = require("../models/auteur.modele");
const fs = require("fs");

exports.auteur_affichage = (requete, reponse) => {
    auteurModel.findById({_id:requete.params.id})
    .exec()
    .then(auteur =>{
        //console.log(auteur);
        reponse.render("auteurs/auteur.html.twig",{auteur:auteur});
    })
    .catch(error => {
        console.log(error);
    });

    
}

//auteurModel.findById({_id:requete.params.id})