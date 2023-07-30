export function SuccessResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200,
) {
  return {
    message,
    statusCode,
    data,
  };
}
