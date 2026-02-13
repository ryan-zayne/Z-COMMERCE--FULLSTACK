import { cnJoin } from "@/lib/utils/cn";
import { ForWithWrapper } from "../primitives/for";
import { Skeleton } from "../ui/skeleton";

type SkeletonProps = {
	count?: number;
	variant?: "genericPage" | "productItemPage";
};

function LoadingSkeleton({ count = 5, variant = "genericPage" }: SkeletonProps) {
	const SKELETON_LOOKUP = {
		default: () => {
			throw new Error(`Case ${variant} is unhandled`);
		},

		genericPage: () => (
			<section className="mt-[80px] flex flex-col gap-[60px] pt-[60px]">
				<article className="flex flex-col gap-[30px] px-[30px]">
					<ForWithWrapper
						className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] justify-items-center
							gap-[30px_15px]"
						each={count}
						renderItem={(id) => (
							<li
								key={id}
								className={cnJoin(
									"w-[min(100%,260px)] rounded-[12px] transition-[scale,box-shadow]"
								)}
							>
								<div className="relative h-[180px] w-full overflow-hidden rounded-[8px_8px_0_0]">
									<Skeleton className="size-full dark:bg-gray-700" />
								</div>

								<div className="px-3.5 pt-2.5">
									<header className="flex min-h-[72px] items-center justify-between gap-2.5">
										<div className="flex flex-col gap-2">
											<Skeleton className="h-5 w-32 dark:bg-gray-700" />
											<Skeleton className="h-4 w-24 dark:bg-gray-700" />
										</div>
										<Skeleton className="h-6 w-16 dark:bg-gray-700" />
									</header>

									<span className="mt-[6px] flex min-h-[60px] max-w-[30ch] flex-col gap-2">
										<Skeleton className="h-3 w-full dark:bg-gray-700" />
										<Skeleton className="h-3 w-full dark:bg-gray-700" />
										<Skeleton className="h-3 w-3/4 dark:bg-gray-700" />
									</span>
								</div>

								<div className="p-[13px_10px_10px]">
									<ForWithWrapper
										as="article"
										each={5}
										className="flex gap-1"
										renderItem={(index) => (
											<Skeleton key={index} className="h-4 dark:bg-gray-700" />
										)}
									/>

									<hr className="mt-2 h-[1.8px] w-full" />

									<Skeleton className="mt-2.5 h-8 w-24 rounded-md dark:bg-gray-700" />
								</div>
							</li>
						)}
					/>
				</article>
			</section>
		),

		productItemPage: () => (
			<section className="p-[10px_20px_80px] lg:pt-[30px]">
				<header className="mx-[5px] flex items-center justify-between lg:mx-[30px]">
					<div className="flex gap-4">
						<Skeleton className="h-8 w-32 dark:bg-gray-700" />
						<Skeleton className="h-6 w-24 dark:bg-gray-700" />
					</div>
					<Skeleton className="h-8 w-20 dark:bg-gray-700" />
				</header>

				<div
					className="mt-[30px] md:mt-[45px] md:flex md:h-[470px] md:justify-around md:gap-[40px]
						md:px-[10px] lg:mt-[60px] lg:gap-[80px]"
				>
					<div className="h-[350px] w-[min(100%,500px)] max-md:mx-auto md:h-full">
						<div className="relative size-full overflow-hidden rounded-[7px]">
							<Skeleton className="size-full dark:bg-gray-700" />

							<div className="absolute top-1/2 left-2 -translate-y-1/2">
								<Skeleton className="size-10 rounded-md dark:bg-gray-700" />
							</div>
							<div className="absolute top-1/2 right-2 -translate-y-1/2">
								<Skeleton className="size-10 rounded-md dark:bg-gray-700" />
							</div>

							<ForWithWrapper
								as="div"
								each={3}
								className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
								renderItem={(index) => (
									<Skeleton key={index} className="size-2 rounded-full dark:bg-gray-700" />
								)}
							/>
						</div>
					</div>

					<article
						className="mt-[25px] flex max-w-[460px] flex-col max-md:mx-auto md:mt-0 lg:gap-[20px]
							lg:pb-[5px]"
					>
						<div className="flex items-center justify-between lg:w-[90%]">
							<div>
								<Skeleton className="h-8 w-32 lg:h-9 lg:w-40 dark:bg-gray-700" />
								<ForWithWrapper
									as="div"
									each={5}
									className="mt-1 flex gap-1"
									renderItem={(index) => (
										<Skeleton key={index} className="size-4 dark:bg-gray-700" />
									)}
								/>
							</div>
							<Skeleton className="h-7 w-20 lg:h-8 lg:w-24 dark:bg-gray-700" />
						</div>

						<div className="mt-[20px]">
							<Skeleton className="h-8 w-32 lg:h-9 lg:w-40 dark:bg-gray-700" />
							<div className="mt-1 flex flex-col gap-2">
								<Skeleton className="h-4 w-full dark:bg-gray-700" />
								<Skeleton className="h-4 w-full dark:bg-gray-700" />
								<Skeleton className="h-4 w-3/4 dark:bg-gray-700" />
							</div>
						</div>

						<div className="mt-[35px] flex items-center gap-[40px] md:mt-[45px] lg:gap-[60px]">
							<div
								className="flex w-[140px] items-center justify-between rounded-[40px] bg-gray-200
									p-[6px_11px] md:w-[170px] dark:bg-gray-800"
							>
								<Skeleton className="size-6 rounded-full dark:bg-gray-600" />
								<Skeleton className="h-6 w-8 dark:bg-gray-600" />
								<Skeleton className="size-6 rounded-full dark:bg-gray-600" />
							</div>

							<div className="whitespace-nowrap">
								<Skeleton className="h-4 w-32 md:h-5 md:w-36 dark:bg-gray-700" />
								<Skeleton className="mt-1 h-4 w-20 dark:bg-gray-700" />
							</div>
						</div>

						<div className="mt-[40px] flex gap-[30px] font-medium md:mt-auto md:justify-between">
							<Skeleton className="h-10 w-[150px] rounded-md lg:w-[200px] dark:bg-gray-700" />
							<Skeleton className="h-10 w-[150px] rounded-md lg:w-[200px] dark:bg-gray-700" />
						</div>
					</article>
				</div>
			</section>
		),
	};

	return SKELETON_LOOKUP[variant]();
}

export { LoadingSkeleton };
