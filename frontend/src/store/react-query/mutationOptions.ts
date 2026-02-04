import { mutationOptions } from "@tanstack/react-query";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";

export const resendVerificationEmailMutation = () => {
	return mutationOptions({
		mutationFn: (email: string) => {
			return callBackendApiForQuery("@post/auth/resend-verification", {
				body: { email },
			});
		},

		mutationKey: ["auth", "resend-verification"],
	});
};
