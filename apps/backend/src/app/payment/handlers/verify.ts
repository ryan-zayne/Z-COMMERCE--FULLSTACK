import { VerifyPaymentSchema } from "@z-commerce/shared/validation/backendApiSchema";
import { catchAsync } from "@/middleware";
import { AppError, AppResponse, getValidatedValue } from "@/utils";
import { paystackApi, paystackHook, processPayment } from "../services/paystack";

export const verifyWithHook = catchAsync(async (req, res) => {
	await paystackHook(req, { onSuccess: (ctx) => processPayment(ctx.payload) });

	return AppResponse(res, {
		data: null,
		message: "Transaction successful",
	});
});

export const verifyWithApi = catchAsync(async (req, res) => {
	const { reference } = getValidatedValue(req.body as never, VerifyPaymentSchema);

	const result = await paystackApi.verifyTransaction(reference);

	if (!result.data) {
		throw new AppError({ code: 400, message: result.message });
	}

	if (result.data.status !== "success") {
		throw new AppError({
			code: 402,
			errors: { status: result.data.status },
			message: "Transaction incomplete",
		});
	}

	await processPayment(result.data);

	return AppResponse(res, {
		data: null,
		message: "Transaction successful",
	});
});
