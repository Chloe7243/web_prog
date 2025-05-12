import express from "express";
import { exec } from "child_process";
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
const PORT = 8080;
const URL = `http://localhost:${PORT}`;

app.use(express.static("../client", { extensions: ["html"] }));

app.use(express.json());

app.get("/get-races", getRaces);
app.post("/save-results", validateRaceBody, saveResults);
app.delete("/delete-race/:id", validateDeleteId, deleteRace);
app.get("/race-results/:id", validateResultParams, getRaceResults);

app.listen(PORT, (error) => {
  if (error) {
    console.error("Couldn't listen on PORT");
  } else {
    const platform = process.platform;

    if (platform === "darwin") {
      // macOS
      exec(`open -a "Google Chrome" ${URL}`);
    } else if (platform === "win32") {
      // Windows
      exec(`start chrome ${URL}`);
    } else if (platform === "linux") {
      exec(`google-chrome ${URL} || chromium-browser ${URL}`);
    } else {
      console.log("Unsupported platform, please open manually.");
    }
  }
});
