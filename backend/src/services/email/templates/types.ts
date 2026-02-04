export type CommonFields = {
	to: string;
};

export type VerifyEmailData = CommonFields & {
	email: string;
	name: string;
	verificationLink: string;
};
