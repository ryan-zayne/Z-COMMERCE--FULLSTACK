import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import { LoadingSpinner } from "./components/primitives/LoadingSpinner";
import { composeLoaders, productLoader, sessionLoader } from "./store/react-query/loaders";
import { getQueryClient } from "./store/react-query/queryClient";

// Layouts
const HomeLayout = lazy(() => import("@/pages/(home)/layout"));
const AuthLayout = lazy(() => import("@/pages/auth/layout"));
const VerifyEmailLayout = lazy(() => import("@/pages/auth/verify-email/layout"));
const ProtectionLayout = lazy(() => import("@/pages/layout.protect"));

// Error Pages
const NotFoundPage = lazy(() => import("@/pages/not-found"));
const ErrorPage = lazy(() => import("@/pages/error"));

/* eslint-disable react-x/no-nested-lazy-component-declarations */
const routes = createRoutesFromElements(
	<Route errorElement={<ErrorPage />}>
		<Route
			loader={composeLoaders(sessionLoader, productLoader)}
			Component={HomeLayout}
			errorElement={<ErrorPage />}
		>
			<Route path="/" Component={lazy(() => import("@/pages/(home)/page"))} />

			<Route path="/products" Component={lazy(() => import("@/pages/products/page"))} />

			<Route
				path="/products/:category"
				Component={lazy(() => import("@/pages/products/[category]/page"))}
			/>

			<Route
				path="/products/:category/:id"
				Component={lazy(() => import("@/pages/products/[category]/[id]/page"))}
			/>

			<Route path="/about" Component={lazy(() => import("@/pages/about/page"))} />

			<Route path="/checkout" Component={lazy(() => import("@/pages/checkout/page"))} />

			<Route path="/checkout/success" Component={lazy(() => import("@/pages/checkout/success/page"))} />

			<Route Component={ProtectionLayout}>
				<Route path="/user/account" Component={lazy(() => import("@/pages/user/account/page"))} />
			</Route>
		</Route>

		<Route Component={AuthLayout}>
			<Route path="/auth/signup" Component={lazy(() => import("@/pages/auth/signup/page"))} />
			<Route path="/auth/signin" Component={lazy(() => import("@/pages/auth/signin/page"))} />

			<Route Component={VerifyEmailLayout} loader={sessionLoader}>
				<Route
					path="/auth/verify-email"
					Component={lazy(() => import("@/pages/auth/verify-email/page"))}
				/>
				<Route
					path="/auth/verify-email/token"
					Component={lazy(() => import("@/pages/auth/verify-email/token/page"))}
				/>
				<Route
					path="/auth/verify-email/success"
					Component={lazy(() => import("@/pages/auth/verify-email/success/page"))}
				/>
			</Route>
		</Route>

		<Route path="*" element={<NotFoundPage />} />
	</Route>
);
/* eslint-enable react-x/no-nested-lazy-component-declarations */

const browserRouter = createBrowserRouter(routes);

export function Router() {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Suspense fallback={<LoadingSpinner />}>
				<RouterProvider router={browserRouter} />
			</Suspense>

			<ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
		</QueryClientProvider>
	);
}
