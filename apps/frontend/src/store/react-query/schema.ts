import { z } from "zod";

export const ProductItemSchema = z.object({
	brand: z.string(),
	category: z.string(),
	description: z.string(),
	id: z.number(),
	images: z.array(z.string()),
	price: z.number(),
	rating: z.number(),
	stock: z.number(),
	thumbnail: z.string(),
	title: z.string(),
});

export const DummyResponseDataSchema = z.object({
	products: z.array(ProductItemSchema),
});
