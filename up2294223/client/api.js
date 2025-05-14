import { userID } from "./utils/constants.js";

export async function saveResults(body, onSuccess, onFailure) {
  try {
    const response = await fetch("/save-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
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
      throw Error(data.error);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {}
}

export async function uploadTimedResults(body, onSuccess, onFailure) {
  const { raceId, ...dto } = body;
  try {
    const response = await fetch(`/upload-results/${raceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      dto,
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

export async function getUserRaces(onSuccess, onFailure) {
  try {
    const response = await fetch(`/get-races/${userID}`);
    const data = await response.json();
    console.log(data);

    if (!response.ok || !data.success) {
      throw Error(data.error);
    } else {
      onSuccess?.(data);
    }
  } catch (error) {
    onFailure?.(error.message);
  }
}

export async function deleteRace(id, onSuccess, onFailure) {
  try {
    const response = await fetch(`/delete-race/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userID }),
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
