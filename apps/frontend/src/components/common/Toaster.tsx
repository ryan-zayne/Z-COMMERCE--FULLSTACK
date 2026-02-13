"use client";

import { Toaster as Sonner } from "sonner";
import { useThemeStore } from "@/store/zustand/themeStore";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const SonnerToaster = (props: ToasterProps) => {
	const theme = useThemeStore((state) => state.theme);

	return (
		<Sonner
			theme={theme}
			richColors={true}
			// eslint-disable-next-line tailwindcss-better/no-unknown-classes
			className="toaster group"
			position="bottom-right"
			duration={3000}
			closeButton={true}
			toastOptions={{
				classNames: {
					description: "group-[.toaster]:text-[14px]",

					title: "group-[.toaster]:text-base group-[.toaster]:font-bold",

					toast: "group toast p-5 mx-auto max-w-[280px] md:max-w-[300px]",
					// toast: "group toast p-5 max-md:p-4 mx-auto max-md:h-auto max-md:max-w-[284px] group-[.toaster]:bg-shadcn-background group-[.toaster]:text-shadcn-foreground group-[.toaster]:border-shadcn-border group-[.toaster]:shadow-lg",
					// success:
					// 	"group success group-[.toaster]:data-[type=success]:bg-sonner-success-bg group-[.toaster]:data-[type=success]:text-sonner-success-text data-[type=success]:border-sonner-success-border",
					// error: "group error group-[.toaster]:data-[type=error]:bg-sonner-error-bg group-[.toaster]:data-[type=error]:text-sonner-error-text group-[.toaster]:data-[type=error]:border-sonner-error-border",
					// title: "group-[.toaster]:text-[16px] group-[.toaster]:font-bold",
					// description:
					// 	"group-[.toaster]:text-[14px] group-[.toast]:text-shadcn-muted-foreground group-[.toast.error]:text-inherit group-[.toast.success]:text-inherit",
					// closeButton:
					// 	"group-[.toaster]:bg-inherit group-[.toaster]:text-inherit group-[.toaster]:border-inherit hover:group-[.toaster]:data-close-button:border-inherit hover:group-[.toaster]:data-close-button:bg-inherit",
					// actionButton:
					// 	"group-[.toast]:bg-shadcn-primary group-[.toast]:text-shadcn-primary-foreground",
					// cancelButton: "group-[.toast]:bg-shadcn-muted group-[.toast]:text-shadcn-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { SonnerToaster };
