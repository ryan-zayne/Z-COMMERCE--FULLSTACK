import { consola } from "consola";
import mongoose from "mongoose";
import { ENVIRONMENT } from "@/config/env";

export const setConnectionToDb = async () => {
	try {
		const connect = await mongoose.connect(ENVIRONMENT.MONGO_URI, {
			autoIndex: ENVIRONMENT.NODE_ENV === "production",
		});

		console.info(`MongoDB Atlas connected at: ${connect.connection.host}`.cyan.italic.underline);
	} catch (error) {
		consola.error(error);
	}

	/* eslint-disable ts-eslint/unbound-method, ts-eslint/no-deprecated */
	mongoose.connection.on("connected", () => {
		console.info("MongoDB Atlas connected!".bold);
	});

	mongoose.connection.on("disconnected", () => {
		consola.error("MongoDB Atlas disconnected!".bold);
	});
	/* eslint-enable ts-eslint/unbound-method, ts-eslint/no-deprecated */
};
