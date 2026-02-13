import { FooterDropDowns } from "./FooterDropDowns";
import { FooterHeaderSection } from "./FooterHeaderSection";

function Footer() {
	return (
		<footer
			className="flex flex-col pt-[70px] lg:pt-[90px] [&_li]:cursor-pointer [&_li:hover]:text-secondary"
		>
			<FooterHeaderSection />

			<FooterDropDowns />

			<section className="bg-primary py-[20px] text-center text-[14px] font-light text-light italic">
				<p>Copyright 2023 DigitalGenie</p>
			</section>
		</footer>
	);
}

export { Footer };
