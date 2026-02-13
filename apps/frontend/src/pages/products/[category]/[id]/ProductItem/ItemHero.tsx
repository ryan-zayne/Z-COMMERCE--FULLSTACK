import { IconBox } from "@/components/primitives/IconBox";
import { ImageComponent } from "@/components/primitives/ImageComponent";
import { Carousel, type CarouselRootProps } from "@/components/ui/carousel";

type ItemHeroProps = {
	slideImages: Extract<CarouselRootProps["images"], string[]>;
};

function ItemHero({ slideImages }: ItemHeroProps) {
	return (
		<Carousel.Root
			images={slideImages}
			as="div"
			classNames={{
				base: "h-[350px] w-[min(100%,500px)] max-md:mx-auto md:h-full",
				scrollContainer: "rounded-[7px] dark:shadow-[0_0_7px_-1px_hsl(0,0%,40%,0.6)]",
			}}
		>
			<Carousel.Controls
				classNames={{
					base: "px-[8px] lg:px-[20px]",
					iconContainer: `rounded-[5px] bg-carousel-btn p-[8px_5px] transition-transform
					hover:shadow-[0_0_5px_var(--text-dark)] active:scale-[1.11] lg:p-[13px_9px]`,
				}}
				icon={{
					icon: <IconBox icon="bi:chevron-right" />,
					iconType: "nextIcon",
				}}
			/>

			<Carousel.ItemList<typeof slideImages> className={"brightness-[0.65]"}>
				{({ image }) => (
					<Carousel.Item key={image}>
						<ImageComponent imageType={"hasSkeleton"} src={image} />
					</Carousel.Item>
				)}
			</Carousel.ItemList>

			<Carousel.IndicatorList<typeof slideImages>>
				{({ image, index }) => (
					<Carousel.Indicator
						key={image}
						currentIndex={index}
						classNames={{
							base: `bg-[hsl(198,14%,14%)] hover:bg-[hsl(220,62%,31%)]
							hover:shadow-[0_0_5px_hsl(220,62%,31%)]`,
							isActive: "w-[6px] bg-[hsl(220,62%,31%)] p-[4px]",
						}}
					/>
				)}
			</Carousel.IndicatorList>
		</Carousel.Root>
	);
}

export default ItemHero;
