import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Button } from "@/components/primitives/button";
import { sessionQuery } from "@/store/react-query/queryOptions";

function UserAccountPage() {
	const sessionQueryResult = useQuery(sessionQuery());

	return (
		<main className="mx-auto max-w-[1200px] px-[16px] py-[20px] md:px-[40px] md:py-[30px]">
			<header className="flex items-center justify-between border-b pb-[16px] md:pb-[20px]">
				<h1 className="text-[24px] font-bold md:text-[32px]">My Account</h1>
			</header>

			<section className="mt-[20px] grid gap-[20px] md:mt-[40px] md:grid-cols-2 md:gap-[40px]">
				{/* Profile Information */}
				<div className="rounded-lg bg-gray-50 p-[16px] md:p-[20px] dark:bg-gray-800">
					<h2 className="mb-[16px] text-[18px] font-medium md:mb-[20px] md:text-[20px]">
						Profile Information
					</h2>

					<div className="flex flex-col gap-[12px] text-[14px] md:gap-[16px] md:text-[16px]">
						<div>
							<span className="font-medium">Username:</span>
							<p className="mt-[4px] text-gray-600 dark:text-gray-400">
								{sessionQueryResult.data?.data.user.username}
							</p>
						</div>

						<div>
							<span className="font-medium">Email:</span>
							<p className="mt-[4px] text-gray-600 dark:text-gray-400">
								{sessionQueryResult.data?.data.user.email}
							</p>
						</div>

						<div>
							<span className="font-medium">Email Verified:</span>
							<p className="mt-[4px] text-gray-600 dark:text-gray-400">
								{sessionQueryResult.data?.data.user.isEmailVerified ? "Yes" : "No"}
							</p>
						</div>
					</div>

					<Button
						theme="primary"
						className="mt-[20px] w-full rounded-[8px] bg-navbar py-[12px] text-[14px] font-medium
							text-white hover:bg-primary md:rounded-[10px] md:py-[15px] md:text-[16px]"
					>
						Edit Profile
					</Button>
				</div>

				{/* Order History */}
				<div className="rounded-lg bg-gray-50 p-[16px] md:p-[20px] dark:bg-gray-800">
					<h2 className="mb-[16px] text-[18px] font-medium md:mb-[20px] md:text-[20px]">
						Recent Orders
					</h2>

					<div className="text-[14px] text-gray-600 md:text-[16px] dark:text-gray-400">
						No orders yet
					</div>

					<Button
						asChild={true}
						theme="primary"
						className="mt-[20px] w-full rounded-[8px] bg-navbar py-[12px] text-[14px] font-medium
							text-white hover:bg-primary md:rounded-[10px] md:py-[15px] md:text-[16px]"
					>
						<Link to="/">Start Shopping</Link>
					</Button>
				</div>
			</section>
		</main>
	);
}

export default UserAccountPage;
