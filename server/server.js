// Usa Ecmascript6
"use strict";

// Loading dependencies
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
// App instand
const app = express();

var dataDoc = require("../database/example.json");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/client/"));

app.get("/page", (req, res) => {
  const page = req.query.number;
  // const data = {
  //   page: req.query.page,
  //   doc: req.query.doc
  // };
  // console.log(dataDoc.pages.length);
  // dataDoc.forEach(doc => {
  //   if(dataDoc.tittle == data.doc)
  // });
  res.send({ success: true, content: dataDoc[0].pages[page].content });
});

app.get("/status", (req, res) => {
  res.send({ success: true });
});

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
  console.log("Server is running...");
});
