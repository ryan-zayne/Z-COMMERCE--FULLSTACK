import { getMoniconProps, type MoniconIconNameType } from "@@/config/monicon/utils";
import { Icon as IconifyIcon, type IconifyIcon as IconifyIconType, type IconProps } from "@iconify/react";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { useMemo } from "react";

export type MoniconIconBoxProps = InferProps<"svg"> & {
	icon: MoniconIconNameType;
	type?: "local";
};

type IconifyIconBoxProps = Omit<IconProps, "icon"> & {
	icon: string | IconifyIconType;
	type: "online";
};

type IconBoxProps = IconifyIconBoxProps | MoniconIconBoxProps;

export function IconBox(props: IconBoxProps) {
	const { icon, type = "local", ...restOfProps } = props;

	switch (type) {
		case "local": {
			return <Monicon icon={icon as never} {...(restOfProps as object)} />;
		}

		case "online": {
			return <IconifyIcon icon={icon} {...(restOfProps as object)} />;
		}

		default: {
			throw new Error("Unknown IconType");
		}
	}
}

export function Monicon(props: Omit<MoniconIconBoxProps, "type">) {
	const { icon, ...restOfProps } = props;

	const { svgInnerHTML, ...restOfMoniconProps } = useMemo(() => getMoniconProps(icon), [icon]);

	return (
		<svg
			{...restOfMoniconProps}
			{...restOfProps}
			// eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
			dangerouslySetInnerHTML={{ __html: svgInnerHTML }}
		/>
	);
}
