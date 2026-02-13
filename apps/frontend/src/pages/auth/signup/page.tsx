import { AnimatePresence, m } from "motion/react";
import { Link, useLocation } from "react-router";
import { facebook } from "@/assets/authPageImages";
import { Button } from "@/components/primitives/button";
import { IconBox } from "@/components/primitives/IconBox";
import { Logo } from "@/components/primitives/Logo";
import { useGlobalStore } from "@/store/zustand/globalStore";
import { SharedForm } from "../components";

function SignUpFormPage() {
	const isDesktop = useGlobalStore((state) => state.isDesktop);
	const isSignUpPath = useLocation().pathname.endsWith("signup");

	return (
		<AnimatePresence>
			{isSignUpPath && (
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
							className="font-roboto text-[38px] font-extrabold text-[hsl(0,0%,20%)]
								max-lg:mt-[20px] dark:text-[hsl(38,9%,76%)]"
						>
							Sign Up
						</h2>
					</header>

					<SharedForm formVariant="signup" />

					<div className="my-[33px] flex items-center">
						<span className="mr-[10px] inline-block h-px w-full bg-carousel-btn" />
						<p className="shrink-0 text-[15px] text-input">Or create an account with</p>
						<span className="ml-[10px] inline-block h-px w-full bg-carousel-btn" />
					</div>

					<footer>
						<div className="flex items-center justify-center gap-[30px] text-[15px]">
							<Button
								unstyled={true}
								type="button"
								className="rounded-[50%] border-2 border-label bg-white p-[8px]"
							>
								<IconBox icon="fa6-brands:google" className="text-[30px]" />
							</Button>

							<Button
								unstyled={true}
								type="button"
								className={"rounded-[50%] border-2 border-facebook bg-facebook"}
							>
								<img className="aspect-square w-[50px] brightness-[0.96]" src={facebook} alt="" />
							</Button>
						</div>

						<p
							className="mx-auto mt-[40px] text-center text-[14px] font-medium text-input
								lg:mt-[30px]"
						>
							Already have an account?
							<Link
								className="ml-[4px] text-[hsl(214,89%,53%)] hover:text-[hsl(214,89%,60%)]"
								to={"/auth/signin"}
							>
								Sign in
							</Link>
						</p>
					</footer>
				</m.div>
			)}
		</AnimatePresence>
	);
}

export default SignUpFormPage;
