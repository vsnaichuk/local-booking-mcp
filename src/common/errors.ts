export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: unknown = null
  ) {
    super(message);
    this.name = "ApiError";
  }
}
