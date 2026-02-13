import { AnimatePresence, m } from "motion/react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { Logo } from "@/components/primitives/Logo";
import { useGlobalStore } from "@/store/zustand/globalStore";
import { SharedForm } from "../components";

function LoginFormPage() {
	const isDesktop = useGlobalStore((state) => state.isDesktop);
	const isLoginPath = useLocation().pathname.endsWith("signin");

	return (
		<AnimatePresence>
			{isLoginPath && (
				<m.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					exit={{ opacity: 0, x: 20 }}
					className="relative z-10 w-[min(100%,480px)] rounded-[4px] bg-body p-[30px_30px]
						md:p-[20px_50px]"
				>
					<header>
						{!isDesktop && <Logo className={"ml-[-8px] w-[160px] md:w-full"} />}

						<h2
							className={`font-roboto text-[38px] font-extrabold text-[hsl(0,0%,20%)]
							max-lg:mt-[15px] dark:text-[hsl(38,9%,76%)]`}
						>
							Login
						</h2>
					</header>

					<SharedForm classNames={{ form: "mt-[30px]" }} formVariant="signin" />

					<div className="my-[30px] flex items-center justify-center text-input">
						<span className="mr-[10px] inline-block h-px w-full bg-carousel-btn" />
						Or
						<span className="ml-[10px] inline-block h-px w-full bg-carousel-btn" />
					</div>

					<footer>
						<div className="flex flex-col items-center text-[15px]">
							<Button
								theme={"ghost"}
								className={`w-[max(80%,270px)] gap-[10px] rounded-[100px] border-2 border-gray-400
								dark:border-carousel-btn`}
							>
								<IconBox icon="fa:google" className="text-[18px]" />
								Continue with Google
							</Button>

							<Button
								className={`mt-[15px] w-[max(80%,270px)] gap-[10px] rounded-[100px] border-2
								border-carousel-btn bg-[hsl(214,89%,38%)] text-light`}
							>
								<IconBox icon="fa:facebook" className="text-[18px]" />
								Continue with Facebook
							</Button>
						</div>

						<p className="mx-auto mt-[40px] text-center text-[13px] font-medium text-input">
							New user?
							<Link
								className="ml-[4px] text-[hsl(214,89%,53%)] hover:text-[hsl(214,89%,60%)]"
								to={"/auth/signup"}
							>
								Create an account
							</Link>
						</p>
					</footer>
				</m.div>
			)}
		</AnimatePresence>
	);
}

export default LoginFormPage;
