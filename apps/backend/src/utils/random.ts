import crypto from "node:crypto";
import { promisify } from "node:util";

export const generateRandomBytes = async (
	options: { encoding?: BufferEncoding; length?: number } = {}
) => {
	const { encoding = "hex", length = 60 } = options;

	const byteLength = Math.ceil(length / 2);

	const promisifiedRandomBytes = promisify(crypto.randomBytes);

	const awaitedBuffer = await promisifiedRandomBytes(byteLength);

	const randomString = awaitedBuffer.toString(encoding).slice(0, length);

	return randomString;
};

export const generateRandomBytesSync = (options: { encoding?: BufferEncoding; length?: number } = {}) => {
	const { encoding = "hex", length = 60 } = options;

	const byteLength = Math.ceil(length / 2);

	const randomString = crypto.randomBytes(byteLength).toString(encoding).slice(0, length);

	return randomString;
};

export const generateRandomUUID = (options: { length?: number } = {}) => {
	const { length } = options;

	const randomUUID = length ? crypto.randomUUID().slice(0, length) : crypto.randomUUID();

	return randomUUID;
};

export const generateRandomInteger = ({ max = 100, min = 0 } = {}) => {
	const randomInteger = crypto.randomInt(min, max);

	return randomInteger;
};
