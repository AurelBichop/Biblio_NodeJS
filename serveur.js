const express = require("express");
const server = express();
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost/biblio", {useNewUrlParser:true, useUnifiedTopology:true});

const livreModel = require("./models/livre.modele");

server.use(express.static("public"));
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:false}))
server.use("/", router);

server.listen(8080);

