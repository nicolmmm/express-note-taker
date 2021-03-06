const { response } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
//const db = require("./db/db.json");

//start port at 3001 or variable location
const PORT = process.env.PORT || 3001;

//use Express.js, express JSON, use public folder for statis files.
const app = express();
app.use(express.json());
app.use(express.static("public"));

//handle path for note taking page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

function getDbJson() {
  return new Promise((resolve, reject) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const dataBase = JSON.parse(data);
        resolve(dataBase);
      }
    });
  });
}

//gets notes from database
app.get("/api/notes", (req, res) => {
  getDbJson().then((db) => res.json(db));
  /* console.log("server is responding", JSON.stringify(db)) */
});

//adds new notes to database.
app.post("/api/notes", (req, res) => {
  res.json(`${req.method} request recieved`);

  console.info("recieved post req", JSON.stringify(req.body));

  const readAppend = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        //assign random id to object
        content.id = Math.floor(Math.random() * 1000000000000 + 1);
        console.log("data is ", data);
        let parsedData = JSON.parse(data);
        console.log("parsed data is ", typeof parsedData, parsedData);
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

//delete method
app.delete("/api/notes/:id", (req, res) => {
  res.status(200).send("recieved Delete request");
  const toDelete = req.params.id;
  //loops through object array to match ID with object and removes object with splice.
  getDbJson().then((db) => {
    for (let index = 0; index < db.length; index++) {
      const element = db[index];
      if (element.id == toDelete) {
        db.splice(index, 1);
      }
    }
    fs.writeFile("./db/db.json", JSON.stringify(db, null, 4), (err) =>
      err ? console.error(err) : console.info(`Data written`)
    );
  });
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/index.html")));

app.listen(PORT, () => console.log(`listening to PORT at ${PORT}`));
