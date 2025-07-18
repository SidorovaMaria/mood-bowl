/**
 * Provides a generic `action` utility function for handling parameter validation,
 * optional authorization, and database connection setup in server-side logic.
 *
 * - Validates input parameters using an optional Zod schema.
 * - Optionally supports authorization logic (not implemented in this snippet just yet)
 * - Ensures a database connection is established before proceeding.
 *
 * Intended for use in backend actions where input validation and database access are required.
 */
import { ZodSchema } from "zod";
import dbConnect from "./mongoose";
import { Session } from "next-auth";
import { auth } from "@/auth";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({ params, schema, authorize }: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Validation failed: ${error.message}`);
      } else {
        throw new Error("Validation failed: Unknown error");
      }
    }
  }
  let session: Session | null = null;
  if (authorize) {
    session = await auth();

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
  }

  await dbConnect();
  return {
    params,
    session,
  };
}
export default action;
