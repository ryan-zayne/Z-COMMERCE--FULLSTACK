import { useRouteError } from "react-router";
import BellSvg from "@/assets/BellSvg";

function ErrorPage() {
	const error = useRouteError() as Error;

	return (
		<section className="fixed inset-0 flex flex-col items-center justify-center text-center">
			<BellSvg />

			<h1 className="mt-[20px] text-[30px]">{error.name}</h1>
			<p className="mt-[10px] italic">{error.message}</p>
		</section>
	);
}

export default ErrorPage;
