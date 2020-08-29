const express = require("express");
const server = express();
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");


server.set('trust proxy', 1) // trust first proxy
server.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))


mongoose.connect("mongodb://localhost/biblio", {useNewUrlParser:true, useUnifiedTopology:true});

const livreModel = require("./models/livre.modele");

server.use(express.static("public"));
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:false}))

server.use((requete,reponse,suite) => {
    reponse.locals.message = requete.session.message;
    delete requete.session.message;
    suite();
});

server.use("/", router);


server.listen(8080);

