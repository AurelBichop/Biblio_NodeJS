const mongoose = require("mongoose");
const auteurModel = require("../models/auteur.modele");
const livreModel = require("../models/livre.modele");
const fs = require("fs");
const auteurModele = require("../models/auteur.modele");

exports.auteur_affichage = (requete, reponse) => {
    auteurModel.findById({_id:requete.params.id})
    .populate("livres")
    .exec()
    .then(auteur =>{
        //console.log(auteur);
        reponse.render("auteurs/auteur.html.twig",{auteur:auteur, isModification : false});
    })
    .catch(error => {
        console.log(error);
    });
}

exports.auteurs_affichage = (requete, reponse) => {
    auteurModel.find()
    .populate("livres")
    .exec()
    .then(auteurs =>{
        //console.log(auteur);
        reponse.render("auteurs/liste.html.twig",{auteurs:auteurs});
    })
    .catch(error => {
        console.log(error);
    });
}

exports.auteurs_ajout = (requete, reponse) => {
    auteur = new auteurModel({
        _id : new mongoose.Types.ObjectId(),
        nom : requete.body.nom,
        prenom: requete.body.prenom,
        age: requete.body.age,
        sexe: requete.body.sexe ? true : false
    })
    auteur.save()
    .then(resultat =>{
        console.log(resultat);
        reponse.redirect("/auteurs");
    })
    .catch(error =>{
        console.log(error);
    })
}

exports.auteurs_suppression = (requete, reponse) => {
    auteurModele.find()
    .where("nom").equals("anonyme")
    .exec()
    .then(anonyme => {
        livreModel.updateMany({"auteur":requete.params.id},{$set:{"auteur":anonyme[0]._id}}, {"multi":true})
        .exec()
        .then(
            auteurModel.remove({_id:requete.params.id})
            .where("nom").ne("anonyme")
            .exec()
            .then(
                reponse.redirect("/auteurs")
            ).catch()
        )
    })
    
}


exports.auteurs_modification = (requete, reponse) => {
    auteurModel.findById({_id:requete.params.id})
    .exec()
    .then(auteur =>{
        //console.log(auteur);
        reponse.render("auteurs/auteur.html.twig",{auteur:auteur, isModification : true});
    })
    .catch(error => {
        console.log(error);
    });
}


exports.auteurs_update = (requete, reponse) => {
    const auteurUpdate = {
        nom : requete.body.nom,
        prenom : requete.body.prenom,
        age : requete.body.age,
        sexe : requete.body.sexe ? true : false,
    };
    auteurModel.updateOne({_id:requete.body.identifiant},auteurUpdate)
    .exec()
    .then(resultat => {
        reponse.redirect("/auteurs");
    }).catch();
}
