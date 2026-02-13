import { Outlet, ScrollRestoration } from "react-router";

function RootLayout() {
	return (
		<div className="isolate flex min-h-svh flex-col">
			<ScrollRestoration />
			<Outlet />
		</div>
	);
}

export default RootLayout;
