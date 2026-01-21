import mongoose, { type Model, type SchemaDefinitionProperty } from "mongoose";
import type { z } from "zod";
import { PaymentStatusEnum } from "@/constants";
import { paystackApiSchema } from "./services/paystack/apiSchema";

type CartItems = z.infer<
	(typeof paystackApiSchema)["routes"]["/transaction/verify/:reference"]["data"]
>["data"]["metadata"]["cartItems"];

type PaymentType = {
	amount: number;
	cartItems: CartItems;
	customerId: SchemaDefinitionProperty;
	paymentDate: string;
	paymentMeta: Record<string, unknown>;
	paymentStatus: keyof typeof PaymentStatusEnum;
	reference: string;
};

const cartItemsSchema = new mongoose.Schema<CartItems[number]>(
	{
		id: {
			type: String,
		},
		name: {
			type: String,
		},
		price: {
			type: Number,
		},
		quantity: {
			type: Number,
		},
	},
	{ _id: false }
);

const PaymentSchema = new mongoose.Schema<PaymentType>({
	amount: {
		type: Number,
	},
	cartItems: {
		type: [cartItemsSchema],
	},
	customerId: {
		ref: "User",
		type: mongoose.Schema.Types.ObjectId,
	},
	paymentDate: {
		type: String,
	},
	paymentMeta: {
		type: Object,
	},
	paymentStatus: {
		default: PaymentStatusEnum.UNPAID,
		enum: Object.values(PaymentStatusEnum),
		type: String,
	},
	reference: {
		type: String,
	},
});

export type PaymentModelType = Model<PaymentType>;

export const PaymentModel =
	(mongoose.models.Payment as PaymentModelType | undefined)
	?? mongoose.model<PaymentType, PaymentModelType>("Payment", PaymentSchema);
