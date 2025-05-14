import handleError from "./utils/handleError.js";

export function validateRaceData(req, res, next) {
  const data = req.body;
  const errors = [];

  // Validate race_name (required, non-empty string)
  if (
    !data?.raceName ||
    typeof data.raceName !== "string" ||
    data.raceName.trim() === ""
  ) {
    errors.push("Race name is required and must be a non-empty string.");
  }
  if (!data?.userId) {
    errors.push("User Id is required");
  }

  // If runners exists, validate it
  if (data?.runnerIds !== undefined) {
    if (!Array.isArray(data.runnerIds)) {
      errors.push("Runner Ids must be an array if provided.");
    } else if (data.runners.length > 0) {
      const runnersIsValid = data.runners.every((runnerId) => {
        const idValid =
          runnerId !== undefined &&
          runnerId !== null &&
          String(runnerId).trim() !== "";

        return idValid && posValid && timeValid;
      });

      if (!runnersIsValid) {
        errors.push("Each runner must have a valid ID");
      }
    }
  }

  if (errors.length > 0) {
    handleError(res, "Invalid data", 400, { messages: errors });
  } else {
    next();
  }
}

export function validateResultData(req, res, next) {
  const data = req.body;
  const { raceId } = req.params;
  const { userId, runners } = data;
  const errors = [];

  console.log({ b: req.body, p: req.params });

  // Validate raceId
  if (!raceId || String(raceId).trim() === "") {
    errors.push("Race ID is missing or invalid.");
  }

  // Validate userId
  if (userId === undefined || userId === null || String(userId).trim() === "") {
    errors.push("User ID is required.");
  }

  // Validate runners array
  if (!runners || !Array.isArray(runners) || runners.length === 0) {
    errors.push("Runners must exist and be a non-empty array.");
  } else {
    const runnersIsValid = data.runners.every((runner) => {
      const { id, position, time } = runner;

      const IDValidation =
        id !== undefined && id !== null && String(id).trim() !== "";

      const positionValidation = Number.isInteger(position) && position > 0;

      const timeRegex = /^([0-9]{2}):([0-5][0-9]):([0-5][0-9])\.[0-9]{3}$/;
      const timeValidation = typeof time === "string" && timeRegex.test(time);
      console.log(IDValidation, positionValidation, timeValidation);

      return IDValidation && positionValidation && timeValidation;
    });

    if (!runnersIsValid) {
      errors.push(
        "Runner ID must not be empty.",
        "All runners' positions must be positive integers.",
        "All runners must have a valid time string in HH:MM:SS.MS format."
      );
    }
  }

  console.log({ errors });

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

export function validateUserId(req, res, next) {
  const data = req.params;
  const errors = [];

  if (!data?.userId || ["null", undefined].includes(!data?.userId)) {
    errors.push(`ID is required`);
  }

  // If errors exist, stop and return a 400 response
  if (errors.length > 0) {
    handleError(res, "Invalid data", 400, { messages: errors });
  } else {
    next();
  }
}

export function validateDeleteId(req, res, next) {
  const data = { ...req.params, ...req.body };
  const errors = [];

  if (!data?.id || (data.id && isNaN(data.id))) {
    errors.push(`ID is required and must be a number`);
  }
  if (!data?.userId) {
    errors.push(`userId is required`);
  }

  // If errors exist, stop and return a 400 response
  if (errors.length > 0) {
    handleError(res, "Invalid data", 400, { messages: errors });
  } else {
    next();
  }
}
