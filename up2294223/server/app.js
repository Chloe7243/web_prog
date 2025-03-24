import express from "express";
import initDb from "./db/index.js";
import { getRaceResults, getRaces, saveResults } from "./controllers.js";
import { validateRaceBody, validateResultParams } from "./middlewares.js";

const app = express();
export const db = initDb();

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello world!");
});

app.get("/get-races", getRaces);
app.post("/save-results", validateRaceBody, saveResults);
app.get("/race-results/:id", validateResultParams, getRaceResults);

app.listen(8080);
