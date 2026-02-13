/* eslint-disable ts-eslint/no-unused-vars */

// == This, is beauty...
(({ age, ...rest }) => rest)({ age: 1, id: 1, name: "a" });

// == This gets input data from a form and returns it in the form of an object instead of a Map. Sexy stuff IMO...
const getFormData = (event: SubmitEvent) => {
	event.preventDefault();
	const data = new FormData(event.target as HTMLFormElement);

	return Object.fromEntries(data.entries());
};

// == This is a function that tries to mimic the overloaded crypto.randomInt function
type CallBackFnType = (err: Error | null, value: number) => void;
const crypto = await import("node:crypto");

function randomIntOverload(max: number): number;
// eslint-disable-next-line ts-eslint/unified-signatures
function randomIntOverload(min: number, max: number): number;
function randomIntOverload(max: number, callback: (err: Error | null, value: number) => void): void;
function randomIntOverload(
	min: number,
	max: number,
	callback: (err: Error | null, value: number) => void
): void;

function randomIntOverload(...args: unknown[]): unknown {
	const HANDLER_LOOKUP = {
		1: ([max]: [number]) => {
			const randomInt = crypto.randomInt(max);

			return randomInt;
		},

		2: ([arg1, arg2]: [number, number | CallBackFnType]) => {
			if (typeof arg2 === "function") {
				const max = arg1;
				const callbackFn = arg2;
				const randomInt = crypto.randomInt(max);

				callbackFn(null, randomInt);

				return;
			}

			const max = Math.max(arg1, arg2);
			const min = Math.min(arg1, arg2);
			const randomInt = crypto.randomInt(min, max);

			return randomInt;
		},

		3: ([min, max, callback]: [number, number, CallBackFnType]) => {
			const randomInt = crypto.randomInt(min, max);

			callback(null, randomInt);
		},
	};

	const selectedHandler = HANDLER_LOOKUP[args.length as keyof typeof HANDLER_LOOKUP];

	return selectedHandler(args as never);
}

// == Comparison alternative to avoid timing attacks
const isTargetToken = crypto.timingSafeEqual(Buffer.from("token"), Buffer.from("refreshToken")); // To avoid timing attacks
