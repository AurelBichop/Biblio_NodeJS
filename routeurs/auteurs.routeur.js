let express = require("express");
let router = express.Router();
const twig = require("twig");
const auteurController = require("../controllers/auteur.controller");

router.get("/:id", auteurController.auteur_affichage);
router.get("/", auteurController.auteurs_affichage);
router.post("/", auteurController.auteurs_ajout);
router.post("/delete/:id", auteurController.auteurs_suppression);
router.get("/modification/:id", auteurController.auteurs_modification);
router.post("/modificationServer", auteurController.auteurs_update);

module.exports = router;