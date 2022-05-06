const { response } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  console.log("req made");
  res.json(db);
});

app.post("/api/notes", (req, res) => {
  res.json(`${req.method} request recieved`);

  console.info("recieved " + JSON.stringify(req.body));

  const readAppend = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        //assign random id to object
        content.id = Math.floor(Math.random() * 1000000000000 + 1);

        let parsedData = JSON.parse(data);
        console.log(parsedData);
        parsedData.push(content);

        writeToFile(file, parsedData);
      }
    });
  };

  const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
      err
        ? console.error(err)
        : console.info(`\nData written to ${destination}`)
    );

  readAppend(req.body, "./db/db.json");
});

app.delete("/api/notes/:id", (req, res) => {
  res.status(200).send("recieved Delete request");
  const toDelete = req.params.id;
  for (let index = 0; index < db.length; index++) {
    const element = db[index];
    if (element.id == toDelete) {
      db.splice(index, 1);
    }
  }
  fs.writeFile("./db/db.json", JSON.stringify(db, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to `)
  );
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/index.html")));

app.listen(PORT, () => console.log(`listening to PORT at ${PORT}`));
