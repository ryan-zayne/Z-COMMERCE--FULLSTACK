import { PaymentStatusEnum } from "@/constants";
import { AppError, generateRandomUUID } from "@/utils";
import { PaymentModel } from "../../model";
import type { PaymentSuccessPayload } from "./api";

export const generateUniqueReference = () => {
	const prefix = "Z-RF";
	const randomCharacters = generateRandomUUID();

	return `${prefix}_${randomCharacters}`;
};

export const processPayment = async (payload: PaymentSuccessPayload) => {
	const payment = await PaymentModel.findOneAndUpdate(
		{ reference: payload.reference },
		{
			amount: payload.amount,
			paymentDate: payload.paid_at,
			paymentMeta: { cartItems: payload.metadata.cartItems },
			paymentStatus: PaymentStatusEnum.PAID,
		},
		{ new: true }
	);

	if (!payment) {
		throw new AppError(404, "Error processing payment");
	}

	// == Sent email to user
	// == Proceed with order
};
