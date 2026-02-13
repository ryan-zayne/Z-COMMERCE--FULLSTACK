import { m } from "motion/react";
import { IconBox } from "@/components/common/IconBox";
import { SearchForm } from "@/components/common/SearchForm";
import { getOnApple, getOnGoogle, NewsletterIcon } from "./images";

function FooterHeaderSection() {
	return (
		<m.section
			initial={{ opacity: 0, y: 100 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7 }}
			// viewport={{ margin: "-20px 0px 0px" }}
			viewport={{ once: true }}
			className="flex flex-col bg-slate-900 bg-footer-image bg-cover bg-center bg-no-repeat
				p-[30px_20px] lg:flex-row lg:justify-between lg:px-[clamp(30px,9vw,180px)]"
		>
			<div className="flex flex-col items-center gap-[10px] lg:gap-[25px]">
				<header className="flex items-center">
					<NewsletterIcon />

					<h4 className="text-[17px] font-medium text-heading lg:text-[24px]">
						Sign Up For NewsLetter
					</h4>
				</header>

				<p className="text-[14px] lg:text-[18px]">$20 discount for your first order</p>

				<SearchForm
					type="subscribe"
					classNames={{
						base: "w-[min(100%,400px)] lg:w-[450px]",
						btn: "p-[9px_15px] text-[14.5px] font-medium lg:p-[12px_26px]",
						input: "lg:py-[9px]",
					}}
					placeholder={"Enter Your Email address..."}
					text="Subscribe"
				/>

				<p className="text-[12px] lg:text-[14px]">Updates on promotions and coupons.</p>
			</div>

			<span className="block bg-carousel-btn max-lg:my-[30px] max-lg:h-px lg:w-px" />

			<div className="flex flex-col items-center gap-[10px] lg:gap-[25px]">
				<h4 className="flex items-center text-[17px] font-medium text-heading lg:text-[24px]">
					Download App On Mobile
				</h4>

				<p className="text-[14px] lg:text-[18px]">15% discount on your first purchase</p>

				<span className="flex gap-[5px] lg:gap-[20px]">
					<img
						className="h-[40px] w-[140px] lg:h-[50px] lg:w-[170px]"
						src={getOnGoogle}
						alt=""
						loading="lazy"
					/>
					<img
						className="h-[40px] w-[140px] lg:h-[50px] lg:w-[170px]"
						src={getOnApple}
						alt=""
						loading="lazy"
					/>
				</span>

				<span
					className="flex gap-[20px] text-[20px] [&_svg]:cursor-pointer [&_svg:hover]:text-secondary"
				>
					<IconBox icon="bi:facebook" />
					<IconBox icon="bi:twitter" />
					<IconBox icon="bi:youtube" />
					<IconBox icon="bi:instagram" />
					<IconBox icon="bi:pinterest" />
				</span>
			</div>
		</m.section>
	);
}

export { FooterHeaderSection };
