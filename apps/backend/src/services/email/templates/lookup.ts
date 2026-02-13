import { verifyEmail } from "./verificationEmail";

export const TEMPLATES_LOOKUP = {
	verifyEmail: {
		from: "DigitalGenie <donotreply@digital-genie.me>",
		subject: "Verify your email address",
		template: verifyEmail,
	},
};
