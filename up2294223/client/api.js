export async function submitResults(body) {
  try {
    const response = await fetch("localhost:8080/save-results", {
      method: "POST",
      body,
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw Error(data.error);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log({ error });
  }
}
