export function successResponse<T>(data: T, message = "OK") {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(code: string, message: string, details?: unknown) {
  return {
    success: false,
    error: {
      code,
      message,
      details: details ?? null,
    },
  };
}
