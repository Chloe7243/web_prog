import { db } from "./app.js";
import handleError from "./utils/handleError.js";

export async function saveResults(req, res) {
  const data = req.body;
  db.run(
    `INSERT INTO races (race_name) VALUES (?)`,
    [data.raceName],
    function (err) {
      if (err) return handleError(res, err, 400);

      const raceID = this.lastID;
      const runners = data.runners;
      const sql = `INSERT INTO race_results (race_id, runner_id, finish_time, position) VALUES ${runners
        .map(() => `(?, ?, ?, ?)`)
        .join(", ")}`;

      db.run(
        sql,
        runners.flatMap((runner) => [
          raceID,
          runner.id,
          runner.time,
          runner.position,
        ]),
        (err) => {
          if (err) return handleError(res, err, 400);
          res.status(201).json({ message: "Results saved", success: true });
        }
      );
    }
  );
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
    db.all(
      `SELECT * from race_results WHERE race_id = ?`,
      id,
      (err, runners) => {
        if (err) {
          throw new Error("Couldn't get race results");
        } else {
          db.get(
            `SELECT * from races WHERE race_id = ?`,
            id,
            (err, raceDetails) => {
              if (err) throw new Error("Couldn't get race results");
              else {
                return res.status(200).json({
                  data: {
                    runners,
                    raceDetails,
                  },
                  success: true,
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    handleError(res, error, 400);
  }
}

export async function deleteRace(req, res) {
  const { id } = req.params;
  try {
    db.all(`DELETE FROM race_results WHERE race_id = ?`, id, (err) => {
      if (err) {
        throw new Error("Couldn't find race results");
      } else {
        db.run(`DELETE FROM races WHERE race_id = ?`, id, (err) => {
          if (err) throw new Error("Couldn't find race");
          else {
            return res.status(200).json({ success: true });
          }
        });
      }
    });
  } catch (error) {
    handleError(res, error, 400);
  }
}
