import { zodResolver } from "@hookform/resolvers/zod";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import type { z } from "zod";
import { Form } from "@/components/primitives/form";
import { Show } from "@/components/primitives/show";
import { Switch } from "@/components/primitives/switch";
import { Button } from "@/components/ui/button";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { SigninBodySchema, SignupBodySchema } from "@/lib/api/callBackendApi/apiSchema";
import { cnMerge } from "@/lib/utils/cn";

export type FormAreaProps = {
	classNames?: { form?: string };
	formVariant: "signin" | "signup";
};

const semanticClasses = {
	error: "border-b-error focus-within:border-b-error dark:focus-within:border-b-error",
};

type FormBodySchemaType = z.infer<typeof SigninBodySchema> & z.infer<typeof SignupBodySchema>;

function SharedForm(props: FormAreaProps) {
	const { classNames, formVariant } = props;
	const navigate = useNavigate();

	const form = useForm<FormBodySchemaType>({
		resolver: zodResolver((formVariant === "signup" ? SignupBodySchema : SigninBodySchema) as never),
	});

	const onSubmit = form.handleSubmit(async (bodyData) => {
		await callBackendApiForQuery(formVariant === "signup" ? `@post/auth/signup` : `@post/auth/signin`, {
			body: bodyData,
			onError: (ctx) => {
				if (isHTTPError(ctx.error) && ctx.error.errorData.errors) {
					const zodFieldErrors = ctx.error.errorData.errors;

					form.setError("root.serverError", {
						message: ctx.error.errorData.message,
					});

					for (const [field, errorMessages] of Object.entries(zodFieldErrors)) {
						form.setError(field as keyof FormBodySchemaType, {
							message: errorMessages as unknown as string,
						});
					}

					return;
				}

				if (isHTTPError(ctx.error)) {
					const errorResponse = ctx.error.errorData;

					form.setError("root.serverError", {
						message: errorResponse.message,
					});

					return;
				}

				form.setError("root.unCaughtError", {
					message: ctx.error.message,
				});
			},

			onSuccess: (ctx) => {
				if (!ctx.data.data.user.isEmailVerified) {
					void navigate("/auth/verify-email");
					return;
				}

				void navigate("/");
			},
		});
	});

	return (
		<Form.Root
			form={form}
			className={cnMerge(
				`mt-6 flex flex-col gap-4.5 [&_input]:text-[14px] lg:[&_input]:text-[16px]
				[&_label]:text-[12px]`,
				classNames?.form
			)}
			onSubmit={(event) => void onSubmit(event)}
		>
			<Show.Root when={formVariant === "signup"}>
				<Form.Field control={form.control} name="username">
					<Form.Label>Username</Form.Label>

					<Form.Input
						classNames={{
							error: semanticClasses.error,
							input: `min-h-8 border-b-2 border-b-carousel-btn bg-transparent text-input
							focus-within:border-b-navbar dark:focus-within:border-b-carousel-dot`,
						}}
						type="text"
					/>

					<Form.ErrorMessage className="text-error" />
				</Form.Field>
			</Show.Root>

			<Form.Field control={form.control} name="email">
				<Form.Label>Email address</Form.Label>

				<Form.Input
					classNames={{
						error: semanticClasses.error,
						input: `min-h-8 border-b-2 border-b-carousel-btn bg-transparent text-input
						focus-within:border-b-navbar dark:focus-within:border-b-carousel-dot`,
					}}
					type="email"
				/>

				<Form.ErrorMessage className="text-error" />
			</Form.Field>

			<Form.Field className="relative" control={form.control} name="password">
				<Form.Label>Password</Form.Label>

				<Form.Input
					classNames={{
						error: semanticClasses.error,
						input: "min-h-8",
						inputGroup: `border-b-2 border-b-carousel-btn bg-transparent text-input
						focus-within:border-b-navbar dark:focus-within:border-b-carousel-dot`,
					}}
					type="password"
				/>

				<Form.ErrorMessage className="text-error" />
			</Form.Field>

			<Show.Root when={formVariant === "signup"}>
				<Form.Field className="relative" control={form.control} name="confirmPassword">
					<Form.Label>Confirm Password</Form.Label>

					<Form.Input
						classNames={{
							error: semanticClasses.error,
							inputGroup: `min-h-8 border-b-2 border-b-carousel-btn bg-transparent text-input
							focus-within:border-b-navbar dark:focus-within:border-b-carousel-dot`,
						}}
						type="password"
					/>

					<Form.ErrorMessage className="text-error" />
				</Form.Field>
			</Show.Root>

			<Form.ErrorMessage
				className="-mt-2.5 mb-[-7px] text-error"
				errorField="serverError"
				type="root"
			/>

			<Form.ErrorMessage
				className="-mt-2.5 mb-[-7px] text-error"
				errorField="unCaughtError"
				type="root"
			/>

			<Form.Field
				className="flex flex-row flex-wrap gap-x-2.5 text-[13px] text-input"
				control={form.control}
				name={formVariant === "signup" ? "acceptTerms" : "rememberMe"}
			>
				<Form.Input type="checkbox" />

				<Switch.Root>
					<Switch.Match when={formVariant === "signin"}>
						<Form.Label>Remember me</Form.Label>
					</Switch.Match>

					<Switch.Match when={formVariant === "signup"}>
						<div className="flex">
							<Form.Label>
								I agree to all
								<Link
									className="ml-[5px] font-medium underline hover:text-[hsl(214,89%,53%)]"
									to="#terms"
								>
									Terms & Conditions
								</Link>
							</Form.Label>
						</div>

						<Form.ErrorMessage className="text-error" />
					</Switch.Match>
				</Switch.Root>
			</Form.Field>

			<Form.StateSubscribe
				render={({ isSubmitting }) => (
					<Button
						className={cnMerge(
							"mt-[15px] rounded-[10px] text-[17px] font-semibold",
							isSubmitting && "cursor-not-allowed brightness-[0.5]"
						)}
						isLoading={isSubmitting}
						disabled={isSubmitting}
						theme="secondary"
						type="submit"
					>
						{formVariant === "signin" ? "Sign In" : "Sign Up"}
					</Button>
				)}
			/>
		</Form.Root>
	);
}

export default SharedForm;
