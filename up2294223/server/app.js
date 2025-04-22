import express from "express";
import initDb from "./db/index.js";
import {
  deleteRace,
  getRaceResults,
  getRaces,
  saveResults,
} from "./controllers.js";
import {
  validateDeleteId,
  validateRaceBody,
  validateResultParams,
} from "./middlewares.js";

const app = express();
export const db = initDb();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5501");
  // res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Respond to preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello world!");
});
app.get("/get-races", getRaces);
app.post("/save-results", validateRaceBody, saveResults);
app.delete("/delete-race/:id", validateDeleteId, deleteRace);
app.get("/race-results/:id", validateResultParams, getRaceResults);

app.listen(8080);
