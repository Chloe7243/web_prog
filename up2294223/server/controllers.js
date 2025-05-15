import { db } from "./app.js";
import handleError from "./utils/handleError.js";

/**
 * Creates a new race and inserts runners if provided.
 */
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

/**
 * Uploads timekeeper results for a race.
 */
export async function uploadTimekeeperResults(req, res) {
  const { raceId } = req.params;
  const { timekeeperId, runners } = req.body;

  const raceStatusQuery = `SELECT status FROM races WHERE race_id = ?`;

  db.get(raceStatusQuery, [raceId], (err, row) => {
    if (err) return handleError(res, err, 400);

    // Check if race exists
    if (!row) {
      return handleError(res, "Race not found.", 404);
    }

    // Check if race has already ended
    if (row.status === "ended") {
      return handleError(
        res,
        "Cannot submit results: Race has already ended.",
        400
      );
    }

    // Proceed with saving the results
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

      res.status(200).json({ success: true });
    });
  });
}

/**
 * Finalizes race results and ends the race.
 */
export async function finalizeResults(req, res) {
  const { raceId } = req.params;
  const data = req.body;
  const { runners, userId } = data;

  // First check if the user is the organizer
  db.get(
    `SELECT organizer_id FROM races WHERE race_id = ?`,
    [raceId],
    (err, row) => {
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

/**
 * Gets all time submissions for a race and resolves conflicts.
 */
export async function getTimeSubmissions(req, res) {
  const { raceId } = req.params;

  if (!raceId || String(raceId).trim() === "") {
    return handleError(res, "Race ID is missing or invalid.", 400);
  }

  try {
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

    const results = [];
    const conflicts = [];
    const groupedByPosition = {};

    // Group submissions by position
    for (const submission of allSubmissions) {
      if (!groupedByPosition[submission.position]) {
        groupedByPosition[submission.position] = [];
      }
      groupedByPosition[submission.position].push(submission);
    }

    for (const [position, submissions] of Object.entries(groupedByPosition)) {
      const uniqueTimes = new Set(submissions.map((s) => s.time));

      if (uniqueTimes.size === 1) {
        // All timekeepers submitted the exact same time
        results.push({
          position: Number(position),
          time: submissions[0].time,
        });
      } else {
        // Conflicting times at this position
        conflicts.push({ position: Number(position) });
      }
    }

    res.status(200).json({
      success: true,
      allSubmissions,
      results,
      conflicts,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
}

/**
 * Gets all races for a user.
 */
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

/**
 * Gets final race results and race details.
 */
export async function getRaceResults(req, res) {
  const { id } = req.params;

  try {
    db.all(
      `SELECT * FROM final_results WHERE race_id = ?`,
      id,
      (err, runners) => {
        if (err) {
          return handleError(res, new Error("Couldn't get race results"), 400);
        } else {
          db.get(
            `SELECT * FROM races WHERE race_id = ?`,
            id,
            (err, raceDetails) => {
              if (err) {
                return handleError(
                  res,
                  new Error("Couldn't fetch race details"),
                  400
                );
              }

              if (!raceDetails) {
                return handleError(res, new Error("Race not found"), 404);
              }

              return res.status(200).json({
                success: true,
                data: {
                  runners,
                  raceDetails,
                },
              });
            }
          );
        }
      }
    );
  } catch (error) {
    handleError(res, error, 400);
  }
}

/**
 * Deletes a race if the user is the organizer.
 */
export async function deleteRace(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return handleError(res, "User ID is required", 400);
  }

  try {
    // First, check if the race exists and get the organizer ID
    db.get(
      `SELECT organizer_id FROM races WHERE race_id = ?`,
      [id],
      (err, row) => {
        if (err) return handleError(res, err, 500);
        if (!row) return handleError(res, "Race not found", 404);

        // Check if the user is the organizer
        if (row.organizer_id !== userId) {
          return handleError(res, "Unauthorized: not the race organizer", 403);
        }

        // Delete race
        db.run(`DELETE FROM races WHERE race_id = ?`, [id], (err) => {
          if (err) return handleError(res, "Couldn't delete race", 500);
          return res.status(200).json({ success: true });
        });
      }
    );
  } catch (error) {
    handleError(res, error, 400);
  }
}
