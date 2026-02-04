import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import { hardNavigate } from "@zayne-labs/toolkit-core";
import { getElementList } from "@zayne-labs/ui-react/common/for";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "@/components/primitives/button";
import { Form } from "@/components/primitives/form";
import { ImageComponent } from "@/components/primitives/ImageComponent";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { sessionQuery } from "@/store/react-query/queryOptions";
import { useShopStore } from "@/store/zustand/shopStore";

const CheckoutSchema = z.object({
	address: z.string().min(10, "Please enter your full address"),
	city: z.string().min(2, "Please enter your city"),
	country: z.string().min(2, "Please enter your country"),
	email: z.email("Please enter a valid email"),
	username: z.string().min(1, "Username is required"),
	zipCode: z.string().min(4, "Please enter a valid zip code"),
});

const [CartItemsList] = getElementList();

function CheckoutPage() {
	const cart = useShopStore((state) => state.cart);
	const totalPrice = useShopStore((state) => state.totalPrice);

	const cartActions = useShopStore((state) => state.actions);
	const navigate = useNavigate();

	const sessionQueryResult = useQuery(sessionQuery());

	const methods = useForm({
		resolver: zodResolver(CheckoutSchema),

		values: {
			address: "",
			city: "",
			country: "",
			email: sessionQueryResult.data?.data.user.email ?? "",
			username: sessionQueryResult.data?.data.user.username ?? "",
			zipCode: "",
		},
	});

	const { control } = methods;

	const onSubmit = methods.handleSubmit(async (formData) => {
		if (!sessionQueryResult.data) {
			void navigate("/auth/signin");
			return;
		}

		const result = await callBackendApi("@post/payment/paystack/initialize", {
			body: {
				amount: totalPrice,
				cartItems: cart.map((item) => ({
					id: String(item.id),
					name: item.title,
					price: item.price,
					quantity: item.quantity,
				})),
				customerEmail: formData.email,
				customerId: sessionQueryResult.data.data.user.id,
				redirectURL: `${window.location.origin}/checkout/success`,
			},
		});

		if (isHTTPError(result.error)) {
			methods.setError("root.serverError", {
				message: result.error.errorData.message,
			});
			return;
		}

		if (result.error) {
			methods.setError("root.caughtError", {
				message: result.error.message,
			});
			return;
		}

		cartActions.clearCart();

		hardNavigate(result.data.data.paymentUrl);
	});

	if (cart.length === 0) {
		return (
			<main className="mx-auto max-w-[1200px] px-[16px] py-[20px] md:p-[30px_30px]">
				<header className="flex items-center justify-between border-b pb-[16px] md:pb-[20px]">
					<h1 className="text-[25px] font-bold md:text-[32px]">Checkout</h1>
				</header>

				<div className="mt-[30px] flex flex-col items-center justify-center gap-[20px] text-center">
					<p className="text-[18px] font-medium text-gray-400">Your cart is empty</p>
					<Button
						theme="primary"
						className="rounded-[4px] bg-navbar px-[20px] py-[10px] text-[16px] font-medium text-white
							transition-all hover:bg-primary"
						onClick={() => void navigate("/")}
					>
						Continue Shopping
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-[1200px] px-[16px] py-[20px] md:p-[30px_30px]">
			<header className="flex items-center justify-between border-b pb-[16px] md:pb-[20px]">
				<h1 className="text-[25px] font-bold md:text-[32px]">Checkout</h1>
			</header>

			<section
				className="mx-auto mt-[20px] flex max-w-[1200px] flex-col gap-[30px] px-[20px] md:mt-[30px]
					md:flex-row md:items-center md:gap-[40px]"
			>
				<Form.Root
					form={methods}
					className="w-full gap-[24px]"
					onSubmit={(event) => void onSubmit(event)}
				>
					<div className="grid gap-[24px] md:grid-cols-2 md:gap-[20px]">
						<div className="md:col-span-2">
							<Form.Field control={control} name="username">
								<Form.Label className="text-[15px] font-medium tracking-tight md:text-[16px]">
									Username
								</Form.Label>
								<Form.Input
									classNames={{
										error: `border-b-error focus-within:border-b-error
										dark:focus-within:border-b-error`,
										input: `min-h-[40px] rounded-[4px] border border-carousel-btn bg-transparent
										px-[12px] text-[14px] text-input transition-colors duration-200
										placeholder:text-gray-400 focus-within:border-navbar md:min-h-[44px]
										md:text-[16px] dark:focus-within:border-carousel-dot`,
									}}
									placeholder="John Doe"
								/>
								<Form.ErrorMessage className="mt-[4px] text-[13px] text-error md:text-[14px]" />
							</Form.Field>
						</div>

						<div className="md:col-span-2">
							<Form.Field control={control} name="email">
								<Form.Label className="text-[15px] font-medium tracking-tight md:text-[16px]">
									Email
								</Form.Label>
								<Form.Input
									classNames={{
										error: `border-b-error focus-within:border-b-error
										dark:focus-within:border-b-error`,
										input: `min-h-[40px] rounded-[4px] border border-carousel-btn bg-transparent
										px-[12px] text-[14px] text-input transition-colors duration-200
										placeholder:text-gray-400 focus-within:border-navbar md:min-h-[44px]
										md:text-[16px] dark:focus-within:border-carousel-dot`,
									}}
									placeholder="johndoe@example.com"
								/>
								<Form.ErrorMessage className="mt-[4px] text-[13px] text-error md:text-[14px]" />
							</Form.Field>
						</div>

						<div className="md:col-span-2">
							<Form.Field control={control} name="address">
								<Form.Label className="text-[15px] font-medium tracking-tight md:text-[16px]">
									Address
								</Form.Label>
								<Form.Input
									classNames={{
										error: `border-b-error focus-within:border-b-error
										dark:focus-within:border-b-error`,
										input: `min-h-[40px] rounded-[4px] border border-carousel-btn bg-transparent
										px-[12px] text-[14px] text-input transition-colors duration-200
										placeholder:text-gray-400 focus-within:border-navbar md:min-h-[44px]
										md:text-[16px] dark:focus-within:border-carousel-dot`,
									}}
									placeholder="123 Main St"
								/>
								<Form.ErrorMessage className="mt-[4px] text-[13px] text-error md:text-[14px]" />
							</Form.Field>
						</div>

						<div>
							<Form.Field control={control} name="city">
								<Form.Label className="text-[15px] font-medium tracking-tight md:text-[16px]">
									City
								</Form.Label>
								<Form.Input
									classNames={{
										error: `border-b-error focus-within:border-b-error
										dark:focus-within:border-b-error`,
										input: `min-h-[40px] rounded-[4px] border border-carousel-btn bg-transparent
										px-[12px] text-[14px] text-input transition-colors duration-200
										placeholder:text-gray-400 focus-within:border-navbar md:min-h-[44px]
										md:text-[16px] dark:focus-within:border-carousel-dot`,
									}}
									placeholder="New York"
								/>
								<Form.ErrorMessage className="mt-[4px] text-[13px] text-error md:text-[14px]" />
							</Form.Field>
						</div>

						<div>
							<Form.Field control={control} name="country" className="text-[15px] md:text-[16px]">
								<Form.Label className="text-[15px] font-medium tracking-tight md:text-[16px]">
									Country
								</Form.Label>
								<Form.Input
									classNames={{
										error: `border-b-error focus-within:border-b-error
										dark:focus-within:border-b-error`,
										input: `min-h-10 rounded-[4px] border border-carousel-btn bg-transparent
										px-[12px] text-[14px] text-input transition-colors duration-200
										placeholder:text-gray-400 focus-within:border-navbar md:min-h-[44px]
										md:text-[16px] dark:focus-within:border-carousel-dot`,
									}}
									placeholder="United States"
								/>
								<Form.ErrorMessage className="mt-[4px] text-[13px] text-error md:text-[14px]" />
							</Form.Field>
						</div>

						<div>
							<Form.Field control={control} name="zipCode">
								<Form.Label className="text-[15px] font-medium tracking-tight md:text-[16px]">
									ZIP Code
								</Form.Label>
								<Form.Input
									classNames={{
										error: `border-b-error focus-within:border-b-error
										dark:focus-within:border-b-error`,
										input: `min-h-[40px] rounded-[4px] border border-carousel-btn bg-transparent
										px-[12px] text-[14px] text-input transition-colors duration-200
										placeholder:text-gray-400 focus-within:border-navbar md:min-h-[44px]
										md:text-[16px] dark:focus-within:border-carousel-dot`,
									}}
									placeholder="10001"
								/>
								<Form.ErrorMessage className="mt-[4px] text-[13px] text-error md:text-[14px]" />
							</Form.Field>
						</div>

						<Form.ErrorMessage
							className="text-center text-[13px] font-medium text-error"
							errorField="caughtError"
							type="root"
						/>

						<Form.ErrorMessage
							className="text-center text-[13px] text-error"
							errorField="serverError"
							type="root"
						/>

						<Form.StateSubscribe
							render={({ isSubmitting }) => (
								<Button
									type="submit"
									theme="primary"
									disabled={isSubmitting}
									isLoading={isSubmitting}
									className="h-[44px] w-full self-end rounded-[4px] bg-navbar text-[15px]
										font-semibold text-white shadow-xs transition-all hover:bg-primary
										hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed
										disabled:brightness-75 md:rounded-[10px] md:text-[16px]"
								>
									Place Order
								</Button>
							)}
						/>
					</div>
				</Form.Root>

				<aside className="rounded-[4px] bg-[#1c2128] p-[20px] md:w-[500px]">
					<h2 className="mb-5 text-[18px] font-semibold">Order Summary</h2>

					<div className="flex flex-col gap-5 divide-y divide-carousel-btn">
						<CartItemsList
							each={cart}
							renderItem={(item) => (
								<li key={item.id} className="flex gap-[16px] pt-[20px]">
									<div className="size-[70px] shrink-0 overflow-hidden rounded-[4px] bg-gray-800">
										<ImageComponent
											src={item.images[0]}
											alt={item.title}
											className="size-full object-cover"
										/>
									</div>

									<div className="flex flex-1 justify-between gap-[10px]">
										<div>
											<h3 className="text-[15px] leading-tight font-medium">{item.title}</h3>
											<p className="mt-[4px] text-[13px] text-gray-400">
												Quantity: {item.quantity}
											</p>
										</div>
										<p className="shrink-0 text-[15px] font-medium">
											${item.price.toLocaleString()}
										</p>
									</div>
								</li>
							)}
						/>

						<div className="flex items-center justify-between pt-[20px] text-base font-semibold">
							<p>Total</p>
							<p>${totalPrice.toLocaleString()}</p>
						</div>
					</div>
				</aside>
			</section>
		</main>
	);
}

export default CheckoutPage;
