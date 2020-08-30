let express = require("express");
let router = express.Router();
const twig = require("twig");
const auteurController = require("../controllers/auteur.controller");

router.get("/:id", auteurController.auteur_affichage);

module.exports = router;