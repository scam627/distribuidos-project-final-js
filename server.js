// Usa Ecmascript6
"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + "/cliente"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var listPages = [];
var id = 0;

app.get("/listPages", (req, res) => {
  res.send(listPages);
});

app.get("/insertPage", (req, res) => {
  if (req.query.name != undefined) {
    const i = id;
    id = id + 1;

    const data = {
      id: i,
      name: req.query.name,
      status: true
    };
    listPages.push(data);
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

app.get("/changestatus", (req, res) => {
  const idd = req.query.id;
  console.log(idd);
  for (let i = 0; i < listPages.length; i++) {
    //console.log(i);
    if (listPages[i].id == idd) {
      //console.log(i);
      listPages[i].status = !listPages[i].status;
    }
  }
  res.send({ success: true });
});

app.get("/status", (req, res) => {
  res.send({ succefull: true });
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log("Server is running...");
});
