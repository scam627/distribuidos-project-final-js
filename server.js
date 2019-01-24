// Usa Ecmascript6
"use strict";

// Loading dependencies
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
// App instand
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/client/"));

var listServers = [];

app.get("/add", (req, res) => {
  if (req.query.host !== undefined && req.query.port !== undefined) {
    const data = {
      host: req.query.host,
      port: req.query.port,
      docs: []
    };
    let state = false;
    listServers.forEach(server => {
      state = state
        ? state
        : data.host == server.host && data.port == server.port;
    });
    if (!state) {
      let options = {
        url: "http://" + data.host + ":" + data.port + "/status",
        method: "GET",
        jar: true
      };
      request(options, (err, resp, body) => {
        if (!err && resp.statusCode == 200) {
          listServers.push(data);
          res.send({ success: true, err: null, msg: "Added" });
        } else {
          res.send({ success: true, err: null, msg: "Server not found" });
        }
      });
    } else res.send({ success: true, err: null, msg: "Server already added" });
  } else res.send({ success: false, err: true, msg: ":(" });
});

app.get("/set", (req, res) => {
  const data = {
    host: req.query.host,
    port: req.query.port,
    doc: req.query.doc,
    page: req.query.page
  };
  listServers.forEach(server => {
    if (data.host == server.host && data.port == server.port) {
      if (listServers.docs.lenght) {
        let state = false;
        listServers.docs.forEach(doc => {
          if (doc.name == doc) {
            listServers.docs.pages.push(data.page); //falta validar que la pagina de ese documento no se de otro server
            state = true;
          }
        });
        if (!state)
          listServers.docs.push({ name: data.doc, pages: [doc.page] });
      } else listServers.docs.push({ name: data.doc, pages: [doc.page] });
    }
  });
  res.send({ success: true });
});

app.get("/server", (req, res) => {
  const data = {
    page: req.query.page,
    doc: req.query.doc
  };
  listServers.forEach(server => {
    server.docs.forEach(doc => {
      if (data.doc == doc.name) {
        doc.pages.forEach(page => {
          if (page == data.page)
            res.send({
              success: true,
              host: listServers.host,
              port: listServers.port
            });
        });
      }
    });
  });
});

app.listen("8080", () => {
  console.log("Server is running...");
});
