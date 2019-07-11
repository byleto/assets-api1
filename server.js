var express = require("express");
var sqlite3 = require("sqlite3");
var database = new sqlite3.Database("frases.db");

var app = express();

var port = 5000;

app.listen(port, function() {
  console.log("Express app listening on port " + port);
});

app.get("/", function(request, response) {
  response.send("Hello, World!");
});

app.get("/frases", function(request, response) {
  database.all("SELECT * FROM Frases", function(err, rows) {
    console.log(
      "GET Frases: La base de datos tiene las siguientes frases" + rows
    );

    response.send(rows);
  });
});

app.get("/frases/:autor", function(request, response) {
  database.all(
    "SELECT * FROM Frases WHERE Autor= ?",
    [request.params.autor],
    function(err, rows) {
      console.log("GET Frases por autor:" + request.params.autor);

      response.send(rows);
    }
  );
});
