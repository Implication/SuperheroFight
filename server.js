const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const sleep = require("util").promisify(setTimeout);

let app = express();
let key = "2435405843455705";
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
let searchHeroes = function() {};

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
  searchHeroes = async id => {
    const res = await axios.get(baseURL + key + "/" + id + "/powerstats");
    return res.data;
  };

  const searchHeroImage = async id => {
    const res = await axios.get(baseURL + key + "/" + id + "/image");
    return res.data;
  };

  const getData = async () => {
    firstHeroData = await searchHeroes(firstHeroId);
    secondHeroData = await searchHeroes(secondHeroId);
    firstHeroImage = await searchHeroImage(firstHeroId);
    secondHeroImage = await searchHeroImage(secondHeroId);
    for (const data in firstHeroData) {
      if (data == null) data = 0;
    }
    for (const data in secondHeroData) {
      if (data == null) data = 0;
    }
  };
  getData();

  async function init() {
    await sleep(3000);
    res.redirect("fight");
  }

  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  init();
});

app.get("/fight", (req, res) => {
  res.render("fight", {
    firstHero: firstHeroData,
    secondHero: secondHeroData,
    firstHeroImage,
    secondHeroImage
  });
  console.log(firstHeroData);
  console.log(secondHeroData);
  console.log(firstHeroImage);
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
