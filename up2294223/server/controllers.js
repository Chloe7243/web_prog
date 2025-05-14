import { db } from "./app.js";
import handleError from "./utils/handleError.js";

export async function createRace(req, res) {
  const data = req.body;
  db.run(
    `INSERT INTO races (race_name, organizer_id) VALUES (?, ?)`,
    [data.raceName, data.userId],
    function (err) {
      if (err) return handleError(res, err, 400);
      const raceID = this.lastID;
      const runners = data.runnerIds;
      if (runners && runners.length) {
        const sql = `INSERT INTO race_runners (race_id, runner_id) VALUES ${runners
          .map(() => `(?, ?)`)
          .join(", ")}`;

        db.run(
          sql,
          runners.map((id) => [raceID, id]),
          (err) => {
            if (err) return handleError(res, err, 400);
          }
        );
      }
      res.status(201).json({
        message: "Race created",
        data: { raceId: raceID },
        success: true,
      });
    }
  );
}

export async function saveResults(req, res) {
  const { raceId } = req.params;
  const { timekeeperId, runners } = req.body;

  // Check if the race status is 'ended'
  const raceStatusQuery = `SELECT status FROM races WHERE race_id = ?`;

  db.get(raceStatusQuery, [raceId], (err, row) => {
    if (err) return handleError(res, err, 400);

    // If race status is 'ended', return an error
    if (row && row.status === "ended") {
      return handleError(
        res,
        "Cannot submit results: Race has already ended.",
        400
      );
    }

    // Proceed with saving the results if the race is not ended
    const stmt = db.prepare(
      "INSERT INTO race_submissions (race_id, timekeeper_id, position, time) VALUES (?, ?, ?, ?)"
    );

    for (const runner of runners) {
      const { position, time } = runner;
      if (typeof position !== "number" || typeof time !== "string") continue;
      stmt.run(raceId, timekeeperId, position, time);
    }

    stmt.finalize((err) => {
      if (err) return handleError(res, err, 400);
    });

    res.status(200).json({ success: true });
  });
}

export async function finalizeResults(req, res) {
  const { raceId } = req.params;
  const data = req.body;
  const { runners, userId } = data;

  // First check if the user is the organizer
  db.get(
    `SELECT organizer_id FROM races WHERE race_id = ?`,
    [raceId],
    (err, row) => {
      console.log(this, err, row);

      if (err) return handleError(res, err, 500);
      if (!row) return handleError(res, "Race not found", 404);

      if (row.organizer_id !== userId) {
        return handleError(res, "Unauthorized: not the race organizer", 403);
      }

      // User is authorized – insert final results
      const sql = `INSERT INTO final_results (race_id, runner_id, time, position) VALUES ${runners
        .map(() => `(?, ?, ?, ?)`)
        .join(", ")}`;

      db.run(
        sql,
        runners.flatMap((runner) => [
          raceId,
          runner.id,
          runner.time,
          runner.position,
        ]),
        (insertErr) => {
          if (insertErr) return handleError(res, insertErr, 400);

          // Update race status to "ended"
          db.run(
            `UPDATE races SET status = 'ended' WHERE race_id = ?`,
            [raceId],
            (updateErr) => {
              if (updateErr) return handleError(res, updateErr, 400);

              res.status(201).json({
                message: "Results saved and race ended",
                success: true,
              });
            }
          );
        }
      );
    }
  );
}

export async function getTimeSubmissions(req, res) {
  const { raceId } = req.params;

  try {
    // Get all time submissions for the race
    const allSubmissions = await new Promise((resolve, reject) => {
      db.all(
        `SELECT position, time, timekeeper_id
         FROM race_submissions
         WHERE race_id = ?`,
        [raceId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Get duplicate time submissions based on position and time
    const raw = await new Promise((resolve, reject) => {
      db.all(
        `SELECT position, time, COUNT(*) as count
         FROM race_submissions
         WHERE race_id = ?
         GROUP BY position, time
         HAVING count > 1`,
        [raceId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Get conflicts where multiple times are recorded for the same position
    const conflicts = await new Promise((resolve, reject) => {
      db.all(
        `SELECT position
         FROM race_submissions
         WHERE race_id = ?
         GROUP BY position
         HAVING COUNT(DISTINCT time) > 1`,
        [raceId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Send the response with all submissions, conflicts, and duplicates
    res.status(200).json({
      success: true,
      allSubmissions, // All time submissions
      conflicts, // Conflicts where different times exist for the same position
      duplicates: raw, // Duplicate submissions for the same position and time
    });
  } catch (error) {
    handleError(res, error, 400);
  }
}

export async function getRaces(req, res) {
  const userId = req.params.userId;

  try {
    db.all(
      `SELECT * FROM races WHERE organizer_id = ?`,
      [userId],
      (err, data) => {
        if (err) {
          return handleError(res, new Error("Couldn't get races"), 400);
        }
        return res.status(200).json({ data, success: true });
      }
    );
  } catch (error) {
    handleError(res, error, 400);
  }
}

export async function getRaceResults(req, res) {
  const { id } = req.params;

  try {
    db.all(
      `SELECT * from final_results WHERE race_id = ?`,
      id,
      (err, runners) => {
        if (err) {
          return handleError(res, new Error("Couldn't get race results"), 400);
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
