import { z } from "zod";

const todoText = z.string().trim().min(1, "Todo text is required").max(140, "Todo text must be 140 characters or fewer");

export const createTodoSchema = z.object({
  text: todoText
});

export const updateTodoSchema = z
  .object({
    text: todoText.optional(),
    completed: z.boolean().optional()
  })
  .refine((value) => value.text !== undefined || value.completed !== undefined, {
    message: "At least one field must be provided"
  });

export function formatValidationError(error: z.ZodError): { message: string; issues: string[] } {
  return {
    message: "The request payload is invalid.",
    issues: error.issues.map((issue) => issue.message)
  };
}
