import { ENVIRONMENT } from "@/config/env";
import { createFetchClient } from "@zayne-labs/callapi";
import type { z } from "zod";
import { paystackApiSchema } from "./apiSchema";

const callPaystackApi = createFetchClient({
	auth: ENVIRONMENT.PAYSTACK_SECRET_KEY,
	baseURL: ENVIRONMENT.PAYSTACK_HOST,
	schema: paystackApiSchema,
});

export const initTransaction = async (
	body: z.infer<(typeof paystackApiSchema)["routes"]["/transaction/initialize"]["body"]>
) => {
	const { data, error } = await callPaystackApi("/transaction/initialize", {
		body,
		method: "POST",
	});

	if (error) {
		return {
			data: null,
			message: error.message || "Error initializing payment",
			success: false,
		};
	}

	return {
		data: data.data,
		message: data.message,
		success: true,
	};
};

export type PaymentSuccessPayload = Pick<
	z.infer<(typeof paystackApiSchema)["routes"]["/transaction/verify/:reference"]["data"]>["data"],
	"amount" | "metadata" | "paid_at" | "reference" | "status"
>;

export const verifyTransaction = async (reference: string) => {
	const result = await callPaystackApi("/transaction/verify/:reference", {
		params: { reference },
	});

	if (result.error) {
		return {
			data: null,
			message: result.error.message || "Error fetching transaction details",
			success: false,
		};
	}

	const payload = {
		amount: result.data.data.amount / 100,
		metadata: result.data.data.metadata,
		paid_at: result.data.data.paid_at,
		reference: result.data.data.reference,
		status: result.data.data.status,
	} satisfies PaymentSuccessPayload;

	return {
		data: payload,
		message: "Transaction verified successfully",
		success: true,
	};
};
