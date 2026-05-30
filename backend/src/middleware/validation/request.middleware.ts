import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ZodError } from "zod";

import { ValidationError } from "../../utils/errors.js";

type ValidationSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

export function validateRequest(schemas: ValidationSchemas) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      if (schemas.params) {
        request.params = schemas.params.parse(request.params) as Request["params"];
      }

      if (schemas.query) {
        request.query = schemas.query.parse(request.query) as Request["query"];
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError("Request validation failed.", formatZodError(error)));
        return;
      }

      next(error);
    }
  };
}
