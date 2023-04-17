export class Errors extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message) {
    return new Errors(400, message);
  }

  static unauthorized() {
    return new Errors(401, 'Требуется авторизоваться');
  }

  static forbidden() {
    return new Errors(403, 'Недостаточно прав');
  }

  static notFound(message) {
    return new Errors(404, message);
  }

  static conflict(message) {
    return new Errors(409, message);
  }

  static iternal() {
    return new Errors(500, 'Что-то пошло не так');
  }
}