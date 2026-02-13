import type { HydratedUserType } from "@/app/auth/types";
import { catchAsync } from "@/middleware";
import { AppResponse, omitSensitiveFields } from "@/utils";

const session = catchAsync<{ user: HydratedUserType }>((req, res) => {
	const currentUser = req.user;

	return AppResponse(res, {
		data: {
			user: omitSensitiveFields(currentUser, ["isDeleted"], { replaceId: true }),
		},
		message: "Authenticated",
	});
});

export { session };
