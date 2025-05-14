/**
 * Local storage key for user ID.
 */
export const localStorageUserID = "userID";
/**
 * Local storage key for race results.
 */
export const localStorageResults = "raceResult";
/**
 * Gets or generates the current user ID.
 */
export const userID =
  localStorage.getItem(localStorageUserID) || crypto.randomUUID();

localStorage.setItem(localStorageUserID, userID);
