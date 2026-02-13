import { cnMerge } from "@/lib/utils/cn";
import { IconBox, type MoniconIconBoxProps } from "./IconBox";

type StarRatingProps = {
	className?: string;
	icon?: string;
	rating: number;
	text?: string;
};

function StarRating(props: StarRatingProps) {
	const { className = "", icon = "ant-design:star-filled", rating, text = "" } = props;

	const iconName = icon as MoniconIconBoxProps["icon"];

	const star5 = [...Array(5).keys()].map((id) => (
		<IconBox icon={iconName} key={id} color="var(--text-header)" />
	));

	const star4 = [...Array(5).keys()].map((id, index) =>
		index === 4 ?
			<IconBox icon={iconName} key={id} color="var(--text-dark)" />
		:	<IconBox icon={iconName} key={id} color="var(--text-header)" />
	);

	return (
		<div className={cnMerge("flex items-center gap-[10px] text-[12px]", className)}>
			<span className="flex">{rating > 4.5 ? star5 : star4}</span>
			<span>
				{rating} {text}
			</span>
		</div>
	);
}

export { StarRating };
