import { userID } from "./utils/constants.js";

/**
 * Finalizes race results and ends the race.
 */
export async function saveResults(body, onSuccess, onFailure) {
  const { raceId, ...dto } = body;
  try {
    const response = await fetch(`/finalize-results/${raceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userID, ...dto }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      onFailure?.(data);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {}
}

/**
 * Fetches race results and details by race ID.
 */
export async function viewRaceResults(id, onSuccess, onFailure) {
  try {
    const response = await fetch(`/get-race-details/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      onFailure?.(data);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {}
}

/**
 * Uploads timekeeper's results for a race.
 */
export async function uploadTimedResults(body, onSuccess, onFailure) {
  const { raceId, ...dto } = body;

  try {
    const response = await fetch(`/upload-results/${raceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timekeeperId: userID, ...dto }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      onFailure?.(data);
      throw Error(data.error);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {}
}

/**
 * Gets all time submissions for a race.
 */
export async function getTimeSubmissions(raceId, onSuccess, onFailure) {
  try {
    const response = await fetch(`/get-time-submissions/${raceId}`);

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw Error(data.error);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {
    onFailure?.(error);
  }
}

/**
 * Creates a new race.
 */
export async function createRace(dto, onSuccess, onFailure) {
  try {
    const response = await fetch(`/create-race`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userID, ...dto }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw Error(data.error);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {
    onFailure?.(error.message);
  }
}

/**
 * Gets all races for the current user.
 */
export async function getUserRaces(onSuccess, onFailure) {
  try {
    const response = await fetch(`/get-races/${userID}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw Error(data.error);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {
    onFailure?.(error.message);
  }
}

/**
 * Deletes a race by ID.
 */
export async function deleteRace(id, onSuccess, onFailure) {
  try {
    const response = await fetch(`/delete-race/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userID }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw Error(data.error);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {
    onFailure?.(error.message);
  }
}
