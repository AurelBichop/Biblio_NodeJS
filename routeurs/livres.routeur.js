let express = require("express");
let router = express.Router();
const twig = require("twig");
const multer = require("multer");
const livreController = require("../controllers/livre.controller");

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

router.get("/", livreController.livres_affichage)
//Ajout d'un Livre
router.post("/", upload.single("image"), livreController.livre_ajout)
//Affichage d'un livre
router.get("/:id", livreController.livre_show)
//Modification d'un livre 
router.get("/modification/:id", livreController.livre_modification);
router.post("/updateImage", upload.single("image"), livreController.livre_update_image)
router.post("/modificationServer", livreController.livre_update)
router.post("/delete/:id", livreController.livre_delete);



module.exports = router;