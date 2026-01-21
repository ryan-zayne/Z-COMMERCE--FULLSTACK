import { useId } from "react";
import { Link } from "react-router";
import { logo } from "@/assets/brand";
import { cnMerge } from "@/lib/utils/cn";

function Logo({ className = "" }: { className?: string }) {
	const reactId = useId();

	return (
		<Link
			id={`Logo-${reactId}`}
			className={cnMerge(`block h-[44.7px] w-[130px] md:h-[55px] md:w-[160px] ${className}`)}
			to={"/"}
		>
			<img className="h-full" src={logo} alt="" />
		</Link>
	);
}

export { Logo };
