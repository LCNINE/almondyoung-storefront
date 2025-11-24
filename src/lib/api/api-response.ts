export class ApiResponse {
  static success<T>(data: T, status = 200) {
    return Response.json({ success: true, data }, { status })
  }

  static error(message: string, status = 400) {
    return Response.json({ success: false, error: message }, { status })
  }

  static unauthorized(message: string, status = 401) {
    return Response.json({ success: false, error: message }, { status })
  }
}
