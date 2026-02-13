import { InitializePaymentBodySchema } from "@z-commerce/shared/validation/backendApiSchema";
import { catchAsync } from "@/middleware";
import { AppError, AppResponse, getValidatedValue } from "@/utils";
import { PaymentModel } from "../model";
import { generateUniqueReference, paystackApi } from "../services/paystack";

const initialize = catchAsync(async (req, res) => {
	const { amount, cartItems, customerEmail, customerId, redirectURL } = getValidatedValue(
		req.body as never,
		InitializePaymentBodySchema
	);

	const reference = generateUniqueReference();

	const transactionResult = await paystackApi.initTransaction({
		amount: Math.round(amount) * 100,
		callback_url: redirectURL,
		email: customerEmail,
		metadata: { cartItems, customerId },
		reference,
	});

	if (!transactionResult.success || !transactionResult.data) {
		throw new AppError({ code: 400, message: "Error processing payment, try again later" });
	}

	const payment = await PaymentModel.create({
		amount,
		cartItems,
		customerId,
		email: customerEmail,
		reference,
	});

	return AppResponse(res, {
		data: {
			paymentDetails: {
				amount: payment.amount,
				cartItems: payment.cartItems,
				customerId: payment.customerId,
				id: payment._id as unknown as string,
				paymentDate: payment.paymentDate,
				paymentMeta: payment.paymentMeta,
				paymentStatus: payment.paymentStatus,
				reference: payment.reference,
			},
			paymentUrl: transactionResult.data.authorization_url,
		},
		message: "Payment initialized successfully",
	});
});

export { initialize };
