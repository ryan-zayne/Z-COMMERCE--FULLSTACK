import type { z } from "zod";
import type { DummyResponseDataSchema, ProductItemSchema } from "./schema";

export type ProductItemSchemaType = z.infer<typeof ProductItemSchema>;

export type DummyResponseDataSchemaType = z.infer<typeof DummyResponseDataSchema>;
