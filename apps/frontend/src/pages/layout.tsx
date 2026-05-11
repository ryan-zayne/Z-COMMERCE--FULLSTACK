import { useEffectOnce } from "@zayne-labs/toolkit-react";
import { Outlet, ScrollRestoration } from "react-router";

function RootLayout() {
	useEffectOnce(() => {
		document.dispatchEvent(new Event("app:ready"));
	});

	return (
		<div className="isolate flex min-h-svh flex-col">
			<ScrollRestoration />
			<Outlet />
		</div>
	);
}

export default RootLayout;
