import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  const { statusCode, success, message, token, data } = responseData;
  const response: Record<string, unknown> = {
    success,
    statusCode,
    message,
    data,
  };

  if (token) {
    response.token = token;
  }

  res.status(statusCode).json(response);
};

export default sendResponse;
