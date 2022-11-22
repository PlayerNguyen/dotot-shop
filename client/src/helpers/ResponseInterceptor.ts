export interface IResponse {
  status: "success" | "error" | "failed";
  message: string;
  data?: any;
}
export interface ErrorResponse extends IResponse {
  status: "error";
  message: string;
  data?: any;
}

export interface SuccessResponse extends IResponse {
  status: "success";
  message: string;
  data?: any;
}

export class ResponseInterceptor {
  public static filterError: (response: any) => ErrorResponse = (
    response: any
  ) => {
    if (!response.response.data) {
      throw new Error(`Invalid response data`);
    }
    const { status, message, data } = response.response.data;
    return {
      status,
      message,
      data,
    };
  };

  public static filterSuccess: (response: any) => SuccessResponse = (
    response: any
  ) => {
    if (!response.data) {
      throw new Error(`Invalid response data`);
    }
    const { status, message, data } = response.data;
    return {
      status,
      message,
      data,
    };
  };
}
