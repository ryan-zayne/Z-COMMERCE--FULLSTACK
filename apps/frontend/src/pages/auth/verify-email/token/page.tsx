import { useMutation } from "@tanstack/react-query";
import { useSearchParamsObject } from "@zayne-labs/toolkit-react";
import { Link, useNavigate } from "react-router";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { verifyEmailMutation } from "@/store/react-query/mutationOptions";

function CheckVerificationTokenPage() {
	const [{ token }] = useSearchParamsObject<{ token: string }>();

	const verifyEmailMutationResult = useMutation(verifyEmailMutation());

	const navigate = useNavigate();

	const onVerify = () => {
		if (!token) return;

		verifyEmailMutationResult.mutate(token, {
			onSuccess: () => {
				void navigate("/auth/verify-email/success");
			},
		});
	};

	return (
		<main
			data-idle={verifyEmailMutationResult.status === "idle" && !verifyEmailMutationResult.isError}
			data-loading={verifyEmailMutationResult.isPending}
			data-error={verifyEmailMutationResult.isError}
			className="group z-10 grid w-[min(100%,480px)] place-items-center rounded-[6px] bg-body p-7.5
				md:px-10"
		>
			<section
				className="invisible flex flex-col items-center gap-6 text-center [grid-area:1/1]
					group-data-[idle=true]:visible"
			>
				<span className="flex size-[70px] items-center justify-center rounded-full bg-primary">
					<IconBox icon="material-symbols:mark-email-unread-rounded" className="size-12" />
				</span>

				<div className="flex flex-col gap-3">
					<h1 className="text-[18px] font-bold">Verify Your Email</h1>
					<p className="text-[15px] text-white">
						Click the button below to verify your email address and activate your account
					</p>
				</div>

				<Button theme="secondary" onClick={onVerify}>
					Verify Email
				</Button>
			</section>

			<section
				className="invisible flex flex-col items-center gap-6 [grid-area:1/1]
					group-data-[loading=true]:visible"
			>
				<IconBox icon="svg-spinners:bars-scale" type="local" className="size-10" />

				<p>Verifying your email, please wait...</p>
			</section>

			<section
				className="invisible flex flex-col items-center gap-6 text-center [grid-area:1/1]
					group-data-[error=true]:visible"
			>
				<span className="flex size-[70px] items-center justify-center rounded-full bg-red-500/20">
					<IconBox icon="material-symbols:error-rounded" className="size-12 text-red-500" />
				</span>

				<div className="flex flex-col gap-3">
					<p className="text-[15px] font-semibold text-white">
						We couldn't verify your email due to{" "}
						{verifyEmailMutationResult.error?.message ?? "an error"}
					</p>

					<p className="mt-1.5 text-[12px] text-carousel-dot">
						Please try again or request a new verification email
					</p>
				</div>

				<Button theme="secondary" asChild={true}>
					<Link to="/auth/verify-email">Try Again</Link>
				</Button>
			</section>
		</main>
	);
}

export default CheckVerificationTokenPage;
