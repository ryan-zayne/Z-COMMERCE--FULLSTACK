import {
	PaymentStatusEnum,
	type InitializePaymentBodySchema,
	type PaymentDetailsSchema,
} from "@z-commerce/shared/validation/backendApiSchema";
import mongoose, { type Model, type SchemaDefinitionProperty } from "mongoose";
import type { z } from "zod";

type CartItems = z.infer<typeof InitializePaymentBodySchema>["cartItems"];

type PaymentType = z.infer<typeof PaymentDetailsSchema> & {
	customerId: SchemaDefinitionProperty;
	paymentDate: string;
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
