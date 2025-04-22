import { validStatuses } from "../utils/constants.js";
import handleError from "./utils/handleError.js";

export function validateRaceBody(req, res, next) {
  const data = req.body;
  const errors = [];

  // Check if runners is an array and not empty
  if (
    !data?.runners ||
    !Array.isArray(data?.runners) ||
    data?.runners.length === 0
  ) {
    errors.push("Runners must exist and be a non-empty array.");
  } else {
    // If runners is an areay validate each runner object
    const runnersIsValid = data.runners.every((runner) => {
      const { id, position, time, status } = runner;

      // Runner ID must be a positive integer
      const IDValidation =
        id !== undefined && id !== null && String(id).trim() !== "";

      // Position must be a positive integer or null (null for DNF)
      const positionValidation =
        position === null || (Number.isInteger(position) && position > 0);

      // Time must be a string in HH:MM:SS:MS format or null (null for DNF)
      const timeRegex = /^([0-9]{2}):([0-5][0-9]):([0-5][0-9])\.[0-9]{3}$/;
      const timeValidation =
        time === null || (typeof time === "string" && timeRegex.test(time));

      // Status must be 'Finished', 'DNF', or 'Disqualified' (optional)
      const statusValidation =
        !status ||
        (typeof status === "string" && validStatuses.includes(status));

      return (
        IDValidation && positionValidation && timeValidation && statusValidation
      );
    });
    if (!runnersIsValid) {
      errors.push(
        `Runner ID must not be empty`,
        `All runners position must either be a positive integer or null.`,
        `All runners must have a valid time string in HH:MM:SS.MS format or null.`,
        `Some runners have an invalid status. Allowed status: ${validStatuses.join(
          ", "
        )}`
      );
    }
  }

  // If errors exist, stop and return a 400 response
  if (errors.length > 0) {
    handleError(res, "Invalid data", 400, { messages: errors });
  } else {
    next();
  }
}

export function validateResultParams(req, res, next) {
  const data = req.params;
  const errors = [];

  if (!data?.id || (data.id && isNaN(data.id))) {
    errors.push(`ID is required and must be a number`);
  }

  // If errors exist, stop and return a 400 response
  if (errors.length > 0) {
    handleError(res, "Invalid data", 400, { messages: errors });
  } else {
    next();
  }
}

export function validateDeleteId(req, res, next) {
  const data = req.params;
  const errors = [];

  if (!data?.id || (data.id && isNaN(data.id))) {
    errors.push(`ID is required and must be a number`);
  }

  // If errors exist, stop and return a 400 response
  if (errors.length > 0) {
    handleError(res, "Invalid data", 400, { messages: errors });
  } else {
    next();
  }
}
