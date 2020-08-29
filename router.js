let express = require("express");
let router = express.Router();
const twig = require("twig");
const livreModel = require("./models/livre.modele");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination : (requete, file, cb) => {
    cb(null, "./public/images/");
  },
  filename : (requete, file, cb) => {
    var date = new Date().toDateString();  
    cb(null, date+"-"+Math.round(Math.random() * 1000)+"-"+file.originalname);
  }
})

const fileFilter = (requete, file, cb) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
    cb(null, true);
  }else{
    cb(new Error("l'image n'est pas accepté"),false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
      fileSize : 1024 * 1024 * 5
  },
  fileFilter : fileFilter
});

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

//Ajout d'un Livre
router.post("/livres", upload.single("image"), (requete, reponse) => {
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
})

//Affichage d'un livre
router.get("/livres/:id", (requete, reponse) => {
    //console.log(requete.params.id);
    livreModel.findById(requete.params.id)
    .exec()
    .then(livre => {
        reponse.render("livres/show.html.twig", {livre:livre, isModification:false})
    })
    .catch(error => {
        console.log(error);
    });
    //reponse.render("livres/show.html.twig",{});
})

//Modification d'un livre 
router.get("/livres/modification/:id", (requete, reponse) =>{
    //console.log(requete.params.id);
    livreModel.findById(requete.params.id)
    .exec()
    .then(livre => {
        reponse.render("livres/show.html.twig", {livre:livre, isModification:true})
    })
    .catch(error => {
        console.log(error);
    });
});

router.post("/livres/updateImage", upload.single("image"), (requete, reponse) => {
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
})

router.post("/livres/modificationServer", (requete, reponse) => {
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
})


router.post("/livres/delete/:id", (requete, reponse) => {
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