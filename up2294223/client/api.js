export async function submitResults(body) {
  try {
    const response = await fetch("http://localhost:8080/save-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    const data = await response.json();
    if (!response.ok) {
      throw Error(data.error);
    } else {
    }
  } catch (error) {
    // console.log({ error });
  }
}
