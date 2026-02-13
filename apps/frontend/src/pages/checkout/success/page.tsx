import { Link } from "react-router";
import { Button } from "@/components/primitives/button";

function CheckoutSuccessPage() {
	return (
		<main
			className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1200px] flex-col items-center
				justify-center px-[16px] py-[20px] md:px-[40px] md:py-[30px]"
		>
			<div
				className="flex max-w-[500px] flex-col items-center gap-[20px] rounded-lg bg-gray-50 p-[20px]
					text-center md:p-[40px] dark:bg-gray-800"
			>
				<div
					className="flex size-[80px] items-center justify-center rounded-full bg-success text-[40px]
						text-white"
				>
					✓
				</div>

				<div className="flex flex-col gap-[10px]">
					<h1 className="text-[24px] font-bold md:text-[32px]">Payment Successful!</h1>

					<p className="text-[14px] text-gray-600 md:text-[16px] dark:text-gray-400">
						Thank you for your order. Your payment has been processed successfully.
					</p>
				</div>

				<Button
					asChild={true}
					theme="primary"
					className="mt-[10px] w-full rounded-[8px] bg-navbar py-[12px] text-[14px] font-medium
						text-white hover:bg-primary md:mt-[20px] md:rounded-[10px] md:py-[15px] md:text-[16px]"
				>
					<Link to="/">Continue Shopping</Link>
				</Button>
			</div>
		</main>
	);
}

export default CheckoutSuccessPage;
