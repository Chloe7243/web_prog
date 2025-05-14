import handleError from "./utils/handleError.js";

export function validateRaceData(req, res, next) {
  const data = req.body;
  const errors = [];

  console.log({ data });

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
  const errors = [];

  // Check if runners is an array and not empty
  if (
    !data?.runners ||
    !Array.isArray(data?.runners) ||
    data?.runners.length === 0
  ) {
    errors.push("Runners must exist and be a non-empty array.");
  } else {
    // If runners is an array validate each runner object
    const runnersIsValid = data.runners.every((runner) => {
      const { id, position, time, status } = runner;

      // Runner ID must not be falsy
      const IDValidation =
        id !== undefined && id !== null && String(id).trim() !== "";

      // Position must be a positive integer
      const positionValidation = Number.isInteger(position) && position > 0;

      // Time must be a string in HH:MM:SS.MS format
      const timeRegex = /^([0-9]{2}):([0-5][0-9]):([0-5][0-9])\.[0-9]{3}$/;
      const timeValidation = typeof time === "string" && timeRegex.test(time);

      return IDValidation && positionValidation && timeValidation;
    });
    if (!runnersIsValid) {
      errors.push(
        `Runner ID must not be empty`,
        `All runners position must either be a positive integer or null.`,
        `All runners must have a valid time string in HH:MM:SS.MS format or null.`
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

export function validateUserId(req, res, next) {
  const data = req.params;
  const errors = [];

  console.log({ data });

  if (!data?.userId || ["null", undefined].includes(!data?.userId)) {
    errors.push(`ID is required`);
  }

  console.log({ errors });

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
