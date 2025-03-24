import { db } from "./app.js";
import handleError from "./utils/handleError.js";

function saveResultsCallback(err, data) {
  if (err) {
    throw new Error("Couldn't save data");
  } else {
    const raceID = this.lastID;
    const runners = data.runners;
    const sql = `INSERT INTO race_results (race_id, runner_id, finish_time, position) VALUES ${runners
      .map(() => `(?, ?, ?, ?)`)
      .join(", ")}`;
    try {
      // Save results in the db
      db.run(
        sql,
        runners.flatMap((runner) => [
          raceID,
          runner.id,
          runner.time,
          runner.position,
        ]),
        (err) => {
          console.log({ err });
          if (err) throw new Error("Couldn't save data");
        }
      );
    } catch (error) {
      handleError(res, error, 400);
    }
  }
}

export async function saveResults(req, res) {
  const data = req.body;
  try {
    // Create race
    db.run(
      `INSERT INTO races (race_name) VALUES (?)`,
      [data.race_name],
      function (err) {
        saveResultsCallback.call(this, err, data);
      }
    );
    res
      .status(201)
      .json({ message: "Post created successfuly", success: true });
  } catch (error) {
    handleError(res, error, 400);
  }
}

export async function getRaces(req, res) {
  try {
    db.all(`SELECT * from races`, (err, data) => {
      if (err) {
        throw new Error("Couldn't get races");
      } else {
        return res.status(200).json({ data, success: true });
      }
    });
  } catch (error) {
    handleError(res, error, 400);
  }
}

export async function getRaceResults(req, res) {
  const { id } = req.params;
  try {
    db.all(`SELECT * from race_results WHERE race_id = ?`, id, (err, data) => {
      if (err) {
        throw new Error("Couldn't get race results");
      } else {
        return res.status(200).json({ data, success: true });
      }
    });
  } catch (error) {
    handleError(res, error, 400);
  }
}
