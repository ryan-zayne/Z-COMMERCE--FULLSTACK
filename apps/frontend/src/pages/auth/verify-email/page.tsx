import { Timer } from "@ark-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Show } from "@zayne-labs/ui-react/common/show";
import { useState } from "react";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { resendVerificationEmailMutation } from "@/store/react-query/mutationOptions";
import { sessionQuery } from "@/store/react-query/queryOptions";

function VerifyEmailPage() {
	const [isResendEmailDisabled, setIsResendEmailDisabled] = useState(true);

	const sessionQueryResult = useQuery(sessionQuery());

	const resentVerificationEmailMutationResult = useMutation(resendVerificationEmailMutation());

	const resendVerificationEmail = () => {
		if (!sessionQueryResult.data) return;

		resentVerificationEmailMutationResult.mutate(sessionQueryResult.data.data.user.email);
	};

	return (
		<main
			className="z-10 flex w-[min(100%,480px)] flex-col items-center gap-[40px] rounded-[6px] bg-body
				px-10 py-[30px]"
		>
			<section className="flex flex-col items-center gap-[20px] text-center">
				<span className="flex size-[70px] items-center justify-center rounded-full bg-primary">
					<IconBox icon="material-symbols:mail-rounded" className="size-12" />
				</span>

				<div className="flex flex-col gap-[15px]">
					<h1 className="text-[25px] font-bold">Check your email</h1>

					<p className="text-[14px] text-white">
						We've sent a verification link to your email address. Please check your inbox and click
						the link to verify your account.
					</p>

					<p className="mt-[8px] text-[12px] text-carousel-dot">
						Don't see the email? Check your spam folder or resend the verification email.
					</p>
				</div>
			</section>

			<section>
				<Timer.Root
					autoStart={true}
					countdown={true}
					onComplete={() => setIsResendEmailDisabled(false)}
					startMs={30 * 1000}
				>
					<Timer.Context>
						{(context) => (
							<Button
								className="text-[13px]"
								theme="secondary"
								isLoading={resentVerificationEmailMutationResult.isPending}
								disabled={isResendEmailDisabled || resentVerificationEmailMutationResult.isPending}
								onClick={() => {
									resendVerificationEmail();
									context.restart();
									setIsResendEmailDisabled(true);
								}}
							>
								<Show.Root when={isResendEmailDisabled}>
									<Timer.Area className="flex items-center gap-1 text-[13px]">
										Resend in <Timer.Item type="seconds" /> seconds
									</Timer.Area>

									<Show.Fallback>Resend Email</Show.Fallback>
								</Show.Root>
							</Button>
						)}
					</Timer.Context>
				</Timer.Root>
			</section>
		</main>
	);
}

export default VerifyEmailPage;
