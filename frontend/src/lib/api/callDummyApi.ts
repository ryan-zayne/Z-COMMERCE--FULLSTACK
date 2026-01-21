import { createFetchClient } from "@zayne-labs/callapi";
import { defineSchema } from "@zayne-labs/callapi/utils";
import { DummyResponseDataSchema } from "@/store/react-query/schema";

const apiSchema = defineSchema({
	"/products/category/:key": {
		data: DummyResponseDataSchema,
	},
});

const callDummyApi = createFetchClient({
	baseURL: "https://dummyjson.com",
	resultMode: "onlyData",
	schema: apiSchema,
	throwOnError: true,
});

export { callDummyApi };
