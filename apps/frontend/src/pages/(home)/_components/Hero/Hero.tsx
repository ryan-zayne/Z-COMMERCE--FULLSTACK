import { useAnimateElementRefs } from "@zayne-labs/toolkit-react";
import { IconBox } from "@/components/common/IconBox";
import { ImageComponent } from "@/components/common/ImageComponent";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { slideImages } from "./images";

function Hero() {
	const { handleElementsAnimation, setAnimatedNode } = useAnimateElementRefs([
		{
			animationClass: "animate-fade-in-down",
			targetElement: "heading",
		},
		{
			animationClass: "animate-fade-in-up",
			targetElement: "button",
		},
		{
			animationClass: "animate-fade-in-up-2",
			targetElement: "paragraph",
		},
	]);

	return (
		<section id="Hero">
			<Carousel.Root
				images={slideImages}
				onSlideBtnClick={handleElementsAnimation}
				classNames={{
					base: "mx-[10px] h-[330px] md:h-[414px] lg:h-[485px]",
					scrollContainer: "rounded-[7px] dark:shadow-[0_0_7px_-1px_hsl(0,0%,40%,0.6)]",
				}}
				autoSlideInterval={8000}
				hasAutoSlide={true}
				shouldPauseOnHover={true}
			>
				<Carousel.Controls
					classNames={{
						base: "px-[7px] md:px-[8px] lg:pr-[20px] lg:pl-[300px]",
						iconContainer: `rounded-[5px] bg-carousel-btn p-[8px_5px]
						hover:shadow-[0_0_5px_var(--text-dark)] lg:p-[13px_9px]`,
					}}
					icon={{
						icon: <IconBox icon="lucide:chevron-right" className="lg:text-[20px]" />,
						iconType: "nextIcon",
					}}
				/>

				<Carousel.ItemList<typeof slideImages>>
					{({ image }) => (
						<Carousel.Item key={image.src} className="brightness-[0.6]">
							<ImageComponent
								className="size-full"
								imageType="hasFallback"
								src={image.src}
								blurSrc={image.blurSrc}
								fetchPriority="high"
							/>
						</Carousel.Item>
					)}
				</Carousel.ItemList>

				<Carousel.Caption
					className="mt-[37px] ml-[45px] flex flex-col items-start text-light md:ml-[75px]
						lg:mt-[80px] lg:ml-[360px]"
				>
					<h1
						ref={setAnimatedNode("heading")}
						className="w-[17ch] font-roboto text-[clamp(20px,4vw+10px,30px)] font-semibold
							text-heading"
					>
						Explore the Future of Technology
					</h1>

					<p
						ref={setAnimatedNode("paragraph")}
						className="z-20 my-[10px_30px] w-[30ch] text-[clamp(13px,1vw+10px,17px)]
							md:my-[18px_37px] lg:w-[40ch] lg:text-[clamp(15px,1vw+10px,20px)]"
					>
						Discover the Latest and most Exquisite Tech Products for Your Home, Office, and On-the-go
						Needs.
					</p>

					<Button
						ref={setAnimatedNode("button")}
						theme="secondary"
						className="z-50 text-[clamp(13px,1vw+10px,17px)] font-semibold transition-shadow
							duration-400 hover:[box-shadow:0_10px_20px_hsl(43,100%,55%,0.4)] active:scale-[1.04]
							max-sm:p-[10px_28px]"
					>
						Shop Now
					</Button>
				</Carousel.Caption>

				<Carousel.IndicatorList<typeof slideImages>>
					{({ image, index }) => (
						<Carousel.Indicator
							key={image.src}
							currentIndex={index}
							classNames={{
								base: `bg-carousel-btn hover:bg-carousel-dot
								hover:[box-shadow:0_0_5px_var(--carousel-dot)]`,
								isActive: "bg-carousel-dot",
							}}
						/>
					)}
				</Carousel.IndicatorList>
			</Carousel.Root>
		</section>
	);
}

export default Hero;
