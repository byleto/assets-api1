var express = require("express");
var sqlite3 = require("sqlite3");
var database = new sqlite3.Database("frases.db");
var colasDB = new sqlite3.Database("colas.sqlite");

var app = express();

var port = 5000;

app.listen(port, function () {
  console.log("Express app listening on port " + port);
});

app.get("/", function (request, response) {
  response.send("Hello, World!");
});

app.get("/frases", function (request, response) {
  database.all("SELECT * FROM Frases", function (err, rows) {
    console.log(
      "GET Frases: La base de datos tiene las siguientes frases" + rows
    );

    response.send(rows);
  });
});

app.get("/frases/:autor", function (request, response) {
  database.all(
    "SELECT * FROM Frases WHERE Autor= ?",
    [request.params.autor],
    function (err, rows) {
      console.log("GET Frases por autor:" + request.params.autor);

      response.send(rows);
    }
  );
});

app.get("/tickets/", function (request, response) {
  const id = colasDB.all("SELECT MAX(id) as id FROM tickets", function (
    err,
    rows
  ) {
    console.log("GET ultimo ticket:", rows);

    response.send(rows[0]);
  });
});

app.post("/tickets/", function (request, response) {
  new Promise(function (resolve, reject) {
    colasDB.get("SELECT MAX(id) as id FROM tickets", function (err, row) {
      console.log("GET ultimo ticket:", row);
      const lastId = row.id;
      resolve(lastId);
    });
  }).then(function (value) {
    const ticketId = value;
    const nuevoTicketId = ticketId + 1;
    const sql = `INSERT INTO tickets VALUES(${nuevoTicketId}, 'en cola')`;
    colasDB.run(sql, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log("Nuevo ticket creado");
    });
    //colasDB.close();
    response.send({ id: nuevoTicketId });
  });
});
