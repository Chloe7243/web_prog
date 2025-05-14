export const localStorageUserID = "userID";
export const localStorageResults = "raceResult";
export const userID =
  localStorage.getItem(localStorageUserID) || crypto.randomUUID();

localStorage.setItem(localStorageUserID, userID);
