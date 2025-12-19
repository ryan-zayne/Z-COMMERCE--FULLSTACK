import { ENVIRONMENT } from "@/config/env";
import { AppError, readValidatedBody } from "@/utils";
import { consola } from "consola";
import type { Request } from "express";
import crypto from "node:crypto";
import type { z } from "zod";
import type { PaymentSuccessPayload } from "./api";
import { paystackApiSchema } from "./apiSchema";

type SuccessEventContext = {
	event: z.infer<(typeof paystackApiSchema)["routes"]["/transaction/verify/:reference"]["data"]>;
	payload: PaymentSuccessPayload;
};

type PaystackHookOptions = {
	onSuccess: (context: SuccessEventContext) => Promise<void>;
};

export const paystackHook = async (req: Request, options: PaystackHookOptions) => {
	const { onSuccess } = options;

	// == Validate event
	const hash = crypto
		.createHmac("sha512", ENVIRONMENT.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest("hex");

	if (!Object.is(hash, req.headers["x-paystack-signature"])) {
		throw new AppError(400, "Invalid Event signature");
	}

	const validBody = readValidatedBody(
		req,
		paystackApiSchema.routes["/transaction/verify/:reference"].data
	);

	switch (validBody.event) {
		case "charge.success": {
			const payload = {
				amount: validBody.data.amount / 100,
				metadata: validBody.data.metadata,
				paid_at: validBody.data.paid_at,
				reference: validBody.data.reference,
				status: validBody.data.status,
			} satisfies PaymentSuccessPayload;

			await onSuccess({ event: validBody, payload });

			consola.success("Event processed successfully");

			break;
		}

		default: {
			consola.error("Event type not handled");
		}
	}
};
