import loadingSpinner from "@/assets/loadingSpinner.svg";
import { Teleport } from "./teleport";

const LOADER_LOOKUP = {
	auth: () => (
		<Teleport to="body">
			<aside
				className="fixed inset-0 z-700 flex items-center justify-center bg-black/60
					backdrop-blur-[1.5px] select-none"
			>
				<img
					className="aspect-square w-[300px] max-md:-translate-y-10 lg:w-[30%]"
					src={loadingSpinner}
					alt=""
				/>
			</aside>
		</Teleport>
	),

	regular: () => (
		<aside id="preloader">
			{/* eslint-disable tailwindcss-better/no-unknown-classes */}
			<div className="dank-ass-loader">
				<div className="row">
					<div className="arrow up outer outer-18" />
					<div className="arrow down outer outer-17" />
					<div className="arrow up outer outer-16" />
					<div className="arrow down outer outer-15" />
					<div className="arrow up outer outer-14" />
				</div>
				<div className="row">
					<div className="arrow up outer outer-1" />
					<div className="arrow down outer outer-2" />
					<div className="arrow up inner inner-6" />
					<div className="arrow down inner inner-5" />
					<div className="arrow up inner inner-4" />
					<div className="arrow down outer outer-13" />
					<div className="arrow up outer outer-12" />
				</div>
				<div className="row">
					<div className="arrow down outer outer-3" />
					<div className="arrow up outer outer-4" />
					<div className="arrow down inner inner-1" />
					<div className="arrow up inner inner-2" />
					<div className="arrow down inner inner-3" />
					<div className="arrow up outer outer-11" />
					<div className="arrow down outer outer-10" />
				</div>
				<div className="row">
					<div className="arrow down outer outer-5" />
					<div className="arrow up outer outer-6" />
					<div className="arrow down outer outer-7" />
					<div className="arrow up outer outer-8" />
					<div className="arrow down outer outer-9" />
				</div>
			</div>
			{/* eslint-enable tailwindcss-better/no-unknown-classes */}
		</aside>
	),
};
function LoadingSpinner({ variant = "regular" }: { variant?: "auth" | "regular" }) {
	return LOADER_LOOKUP[variant]();
}

export { LoadingSpinner };
