export async function submitResults(body, onSuccess, onFailure) {
  try {
    const response = await fetch("http://localhost:8080/save-results", {
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

export async function deleteRaceItem(id, onSuccess, onFailure) {
  try {
    const response = await fetch(`http://localhost:8080/delete-race/${id}`, {
      method: "DELETE",
      params: { id },
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
