import { defineSchema } from "@zayne-labs/callapi/utils";
import { z } from "zod";

export const InitializePaymentSchema = z.object({
	amount: z.number().positive("Amount must be positive"),
	cartItems: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			price: z.number().positive("Price must be positive"),
			quantity: z.int().positive("Quantity must be a positive integer"),
		})
	),
	customerEmail: z.email(),
	customerId: z.string(),
	redirectURL: z.url({ error: "Invalid redirect URL" }).optional(),
});

export const VerifyPaymentSchema = z.object({
	reference: z.string(),
});

const BasePaystackResponseSchema = z.object({
	data: z.unknown(),
	message: z.string(),
	status: z.boolean(),
});

export const PaystackInitTransactionResponseSchema = z.object({
	...BasePaystackResponseSchema.shape,

	data: z.object({
		access_code: z.string(),
		authorization_url: z.string(),
		reference: z.string(),
	}),
});

export const PaystackMetadataSchema = InitializePaymentSchema.pick({
	cartItems: true,
	customerId: true,
});

export const PaystackInitTransactionBodySchema = z.object({
	amount: z.number(),
	callback_url: z.string().optional(),
	email: z.email(),
	metadata: PaystackMetadataSchema.optional(),
	reference: z.string(),
});

const PaystackTransactionStatusSchema = z.enum([
	"abandoned", // Customer has not completed the transaction
	"failed", // Transaction failed
	"ongoing", // Waiting for customer action (OTP/transfer)
	"pending", // Transaction in progress
	"processing", // Similar to pending, specific to direct debit
	"queued", // Transaction queued for later processing
	"reversed", // Transaction reversed/refunded
	"success", // Transaction successful
]);

const ChargeEventSchema = z.enum([
	"charge.dispute.create", // A dispute was logged against your business
	"charge.dispute.remind", // A logged dispute has not been resolved
	"charge.dispute.resolve", // A dispute has been resolved
	"charge.success", // A successful charge was made
	"customeridentification.failed", // A customer ID validation has failed
	"customeridentification.success", // A customer ID validation was successful
	"dedicatedaccount.assign.failed", // This is sent when a DVA couldn't be created and assigned to a customer
	"dedicatedaccount.assign.success", // This is sent when a DVA has been successfully created and assigned to a customer
	"invoice.create", // An invoice has been created for a subscription on your account. This usually happens 3 days before the subscription is due or whenever we send the customer their first pending invoice notification
	"invoice.payment_failed", // A payment for an invoice failed
	"invoice.update", // An invoice has been updated. This usually means we were able to charge the customer successfully. You should inspect the invoice object returned and take necessary action
	"paymentrequest.pending", // A payment request has been sent to a customer
	"paymentrequest.success", // A payment request has been paid for
	"refund.failed", // Refund cannot be processed. Your account will be credited with refund amount
	"refund.pending", // Refund initiated, waiting for response from the processor.
	"refund.processed", // Refund has successfully been processed by the processor.
	"refund.processing", // Refund has been received by the processor.
	"subscription.create", // A subscription has been created
	"subscription.disable", // A subscription on your account has been disabled
	"subscription.expiring_cards", // Contains information on all subscriptions with cards that are expiring that month. Sent at the beginning of the month, to merchants using Subscriptions
	"subscription.not_renew", // A subscription on your account's status has changed to non-renewing.
	"transfer.failed", // A transfer you attempted has failed
	"transfer.success", // A successful transfer has been completed
	"transfer.reversed", // A transfer you attempted has been reversed
]);

const VerificationDataSchema = z.object({
	amount: z.number(),
	authorization: z.object({
		account_name: z.string(),
		authorization_code: z.string(),
		bank: z.string(),
		bin: z.string(),
		brand: z.string(),
		card_type: z.string(),
		country_code: z.string(),
		exp_month: z.string(),
		exp_year: z.string(),
		last4: z.string(),
	}),
	channel: z.string(),
	created_at: z.string(),
	currency: z.string(),
	customer: z.object({
		customer_code: z.string(),
		email: z.email(),
		first_name: z.string(),
		id: z.number(),
		last_name: z.string(),
		metadata: z.unknown(),
		phone: z.string().nullable(),
		risk_action: z.string(),
	}),
	domain: z.string(),
	fees: z.number().nullable(),
	gateway_response: z.string(),
	id: z.number(),
	ip_address: z.string(),
	log: z.object({
		attempts: z.number(),
		authentication: z.string(),
		channel: z.string().nullable(),
		errors: z.number(),
		history: z.array(
			z.object({
				message: z.string(),
				time: z.number(),
				type: z.string(),
			})
		),
		input: z.array(z.unknown()),
		mobile: z.boolean(),
		success: z.boolean(),
		time_spent: z.number(),
	}),
	message: z.string().nullable(),
	metadata: PaystackMetadataSchema,
	paid_at: z.string(),
	plan: z.record(z.string(), z.never()),
	reference: z.string(),
	status: PaystackTransactionStatusSchema,
});

export const paystackApiSchema = defineSchema({
	"/transaction/initialize": {
		body: z.object({
			amount: z.number(),
			callback_url: z.string().optional(),
			email: z.email(),
			metadata: PaystackMetadataSchema.optional(),
			reference: z.string(),
		}),

		data: BasePaystackResponseSchema.extend({
			data: z.object({
				access_code: z.string(),
				authorization_url: z.string(),
				reference: z.string(),
			}),
		}),

		method: z.literal("POST"),
	},

	"/transaction/verify/:reference": {
		data: z.object({
			data: VerificationDataSchema,
			event: ChargeEventSchema,
		}),
	},
});
