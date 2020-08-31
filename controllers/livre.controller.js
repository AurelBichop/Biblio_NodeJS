const mongoose = require("mongoose");
const livreModel = require("../models/livre.modele");
const auteurModel = require("../models/auteur.modele")
const fs = require("fs");
const auteurModele = require("../models/auteur.modele");
const { exec } = require("child_process");

exports.livres_affichage = (requete, reponse) => {
    auteurModel.find()
    .exec()
    .then(auteurs => {
        livreModel.find()
        .populate("auteur")
        .exec()
        .then(livres => {
            console.log(livres);
            reponse.render("livres/liste.html.twig",{livres : livres,auteurs:auteurs, message: reponse.locals.message});
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
    console.log(error);
});
    
   
}

exports.livre_ajout = (requete, reponse) => {
    livre = new livreModel({
        _id : new mongoose.Types.ObjectId(),
        nom : requete.body.titre,
        auteur: requete.body.auteur,
        pages: requete.body.nbPages,
        description: requete.body.description,
        image : requete.file.path.substring(14)
    })
    livre.save()
    .then(resultat =>{
        console.log(resultat);
        reponse.redirect("/livres");
    })
    .catch(error =>{
        console.log(error);
    })
}

exports.livre_show = (requete, reponse) => {
    //console.log(requete.params.id);
    livreModel.findById(requete.params.id)
    .populate("auteur")
    .exec()
    .then(livre => {
        reponse.render("livres/show.html.twig", {livre:livre, isModification:false})
    })
    .catch(error => {
        console.log(error);
    });
    //reponse.render("livres/show.html.twig",{});
}

exports.livre_modification = (requete, reponse) =>{
    auteurModele.find()
    .exec()
    .then(auteurs => {
        //console.log(requete.params.id);
        livreModel.findById(requete.params.id)
        .populate("auteur")
        .exec()
        .then(livre => {
            reponse.render("livres/show.html.twig", {auteurs:auteurs, livre:livre, isModification:true})
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
    
}

exports.livre_update_image = (requete, reponse) => {
    var livre = livreModel.findById(requete.body.identifiant)
    .select("image")
    .exec()
    .then(livre => {
        fs.unlink("./public/images/"+livre.image, error => {
            console.log(error);
        })
        const livreUpdate = {
            image : requete.file.path.substring(14)
        }
        livreModel.update({_id:requete.body.identifiant}, livreUpdate)
        .exec()
        .then(resultat => {
            reponse.redirect("/livres/modification/"+requete.body.identifiant)
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
}

exports.livre_update = (requete, reponse) => {
    const livreUpdate = {
        nom : requete.body.titre,
        auteur: requete.body.auteur,
        pages: requete.body.nbPages,
        description: requete.body.description
    }
    livreModel.updateOne({_id:requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat =>{
        console.log(resultat);
        if(resultat.nModified <1){
            throw new Error("Aucune modification effectué");
        } 
        requete.session.message = {
            type: 'success',
            contenu: 'Modification effectuée'
        }
        reponse.redirect("/livres");
    })
    .catch(error =>{
        console.log(error);
        requete.session.message = {
            type: 'danger',
            contenu: error.message
        }
        reponse.redirect("/livres");
    })
}

exports.livre_delete = (requete, reponse) => {
    var livre = livreModel.findById(requete.params.id)
    .select("image")
    .exec()
    .then(livre => {
        
        fs.unlink("./public/images/"+livre.image, error => {
            console.log(error);
        })

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
    })
    .catch(error => {
        console.log(error);
    })
}
