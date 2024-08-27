export default class AlreadyExistsError extends Error {

  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}