let express = require("express");
let router = express.Router();
const twig = require("twig");


router.get("/", (requete, reponse) => {
    console.log("Page d'accueil GET sur /");
    reponse.render("accueil.html.twig");
})

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