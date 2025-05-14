import path from "path";
import express from "express";
import initDb from "./db/index.js";

import {
  createRace,
  deleteRace,
  finalizeResults,
  getRaceResults,
  getRaces,
  getTimeSubmissions,
  uploadTimekeeperResults,
} from "./controllers.js";
import {
  validateDeleteId,
  validateRaceData,
  validateResultData,
  validateResultParams,
  validateTimekeeperResults,
  validateUserId,
} from "./middlewares.js";
import { fileURLToPath } from "url";

const app = express();
export const db = initDb();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("../client", { extensions: ["html"] }));

// Fix refresh on the app
app.get("*", (req, res, next) => {
  const acceptsHtml =
    req.headers.accept && req.headers.accept.includes("text/html");
  const hasExtension = path.extname(req.path) !== "";

  if (acceptsHtml && !hasExtension) {
    res.sendFile(path.join(__dirname, "../client/index.html"));
  } else {
    next();
  }
});

app.use(express.json());
app.post("/create-race", validateRaceData, createRace);
app.get("/get-races/:userId", validateUserId, getRaces);
app.delete("/delete-race/:id", validateDeleteId, deleteRace);

app.post("/finalize-results/:raceId", validateResultData, finalizeResults);
app.post(
  "/upload-results/:raceId",
  validateTimekeeperResults,
  uploadTimekeeperResults
);
app.get("/get-time-submissions/:raceId", getTimeSubmissions);
app.get("/get-race-details/:id", validateResultParams, getRaceResults);

app.listen(PORT, (error) => {
  if (error) {
    console.error("Couldn't listen on PORT");
  } else {
    console.log("App listening on PORT:", PORT);
  }
});
