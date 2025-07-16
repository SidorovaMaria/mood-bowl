// fetch.ts
// This file provides a generic fetchHandler function for making HTTP requests
//  with built-in timeout support and standardized response formatting.
// It wraps the native fetch API,
//  adds default JSON headers,
//  handles request timeouts using AbortController,
//  and returns a consistent ActionResponse<T>
//  object for both success and error cases.

import { ErrorResponse, SuccessResponse } from "@/types/global";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<SuccessResponse<T> | ErrorResponse> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };
  try {
    const response = await fetch(url, config);
    clearTimeout(id);
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
    }
    // return (await response.json()) as Promise<ActionResponse<T>>;
    return {
      success: true,
      data: (await response.json()) as T,
      message: "Request successful",
      status: response.status,
    };
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error occurred");
    if (error.name === "AbortError") {
      console.log(`Fetch request to ${url} timed out after ${timeout}ms`);
    } else {
      console.error(`Fetch request to ${url} failed:`, error);
    }
    return {
      success: false,
      message: error.message,
      status: 500,
    };
  }
}
