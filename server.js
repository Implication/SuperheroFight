if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const sleep = require("util").promisify(setTimeout);

let app = express();
let key = process.env.key;
let baseURL = "http://superheroapi.com/api/";
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use(express.static(__dirname));

app.set("view engine", "ejs");

let firstHeroData = {};
let secondHeroData = {};
let firstHeroImage = "";
let secondHeroImage = "";

const getData = async (firstHeroId, secondHeroId) => {
  firstHeroData = await searchHeroes(firstHeroId);
  secondHeroData = await searchHeroes(secondHeroId);
  firstHeroImage = await searchHeroImage(firstHeroId);
  secondHeroImage = await searchHeroImage(secondHeroId);
};

const searchHeroes = async id => {
  const res = await axios.get(baseURL + key + "/" + id + "/powerstats");
  return res.data;
};

const searchHeroImage = async id => {
  const res = await axios.get(baseURL + key + "/" + id + "/image");
  return res.data;
};

async function init() {
  await sleep(3500);
  res.redirect("fight");
}

app.post("/", (req, res) => {
  let fHero = req.body.firstHero;
  let sHero = req.body.secondHero;
  let firstHeroId = "";
  let secondHeroId = "";
  let i = 0;
  while (fHero[i] !== " ") {
    firstHeroId += fHero[i];
    i++;
  }
  i = 0;
  while (sHero[i] != " ") {
    secondHeroId += sHero[i];
    i++;
  }

  getData(firstHeroId, secondHeroId)
    .then(() => {
      res.redirect("fight");
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/fight", (req, res) => {
  for (const data in firstHeroData) {
    console.log(firstHeroData[data]);
    if (firstHeroData[data] === "null") {
      firstHeroData[data] = "N/A";
    }
  }
  for (const data in secondHeroData) {
    console.log(secondHeroData[data]);
    if (secondHeroData[data] === "null") {
      console.log("?");
      secondHeroData[data] = "N/A";
    }
  }
  res.render("fight", {
    firstHero: firstHeroData,
    secondHero: secondHeroData,
    firstHeroImage,
    secondHeroImage
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is listening on port 3000");
});
