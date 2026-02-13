import { z } from "zod";
import { AppError } from "./AppError";

const prettifyPath = (path: z.core.$ZodIssue[][number]["path"] | undefined) => {
	if (!path || path.length === 0) {
		return "";
	}

	const pathString = path.map((segment) => segment.toString()).join(".");

	return ` → at ${pathString}`;
};

const prettifyValidationIssues = (issues: z.core.$ZodIssue[]) => {
	const issuesString = issues.map((issue) => `✖ ${issue.message}${prettifyPath(issue.path)}`).join(" | ");

	return issuesString;
};

export const getValidatedValue = <TSchema extends z.ZodType>(
	input: z.infer<TSchema>,
	schema: TSchema,
	schemaName?: string
) => {
	const result = schema.safeParse(input);

	if (!result.success) {
		const message = prettifyValidationIssues(result.error.issues);

		const fieldErrors = z.flattenError(result.error).fieldErrors;

		throw new AppError({
			code: 422,
			errors: fieldErrors,
			message:
				schemaName ?
					`(${schemaName.toUpperCase()}) Validation Error: ${message}`
				:	`Validation Error: ${message}`,
		});
	}

	return result.data as z.infer<TSchema>;
};
