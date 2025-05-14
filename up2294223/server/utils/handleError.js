/**
 * Sends a standardized error response.
 */
export default (res, errorMsg = "Something went wrong", code = 400, json) =>
  res.status(code).json({
    success: false,
    error: errorMsg,
    ...json,
  });
