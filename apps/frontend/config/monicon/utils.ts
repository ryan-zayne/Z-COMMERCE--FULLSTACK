import { moniconLocalIcons, type MoniconIconNameType } from "@@/.monicon/icons";

export const getMoniconProps = (icon: MoniconIconNameType) => {
	const details = moniconLocalIcons[icon];

	return {
		height: "1em",
		svgInnerHTML: details.svgBody,
		viewBox: `0 0 ${details.width} ${details.height}`,
		width: "1em",
	};
};

export type { MoniconIconNameType } from "@@/.monicon/icons";
