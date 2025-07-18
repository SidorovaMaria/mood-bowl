import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestError, ValidationError } from "./http-errors";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    console.log(
      { err: error },
      `${responseType.toUpperCase()} Error: ${error.message}`
    );

    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );

    console.log({ err: error }, `Validation Error: ${validationError.message}`);

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }

  if (error instanceof Error) {
    console.log(error.message);

    return formatResponse(responseType, 500, error.message);
  }

  console.log({ err: error }, "An unexpected error occurred");
  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
