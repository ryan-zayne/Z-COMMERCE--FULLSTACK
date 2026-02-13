import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { useThemeStore } from "@/store/zustand/themeStore";
import { getElementList } from "../primitives/for";

type SkeletonProps = {
	count?: number;
	variant?: "genericPage" | "productItemPage";
};

function LoadingSkeleton({ count = 5, variant = "genericPage" }: SkeletonProps) {
	const isDarkMode = useThemeStore((state) => state.isDarkMode);

	const [SkeletonCardList] = getElementList();

	const SKELETON_LOOKUP = {
		default: () => {
			throw new Error(`Case ${variant} is unhandled`);
		},

		genericPage: () => (
			<section className="mt-[80px] flex flex-col gap-[60px] pt-[60px]">
				<article className="flex flex-col gap-[30px] px-[30px]">
					<SkeletonCardList
						className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] justify-items-center
							gap-[30px_15px]"
						each={[...Array(count).keys()]}
						renderItem={(id) => (
							<li
								key={id}
								className={cnMerge(
									"w-[min(100%,250px)] rounded-[12px] shadow-[0_0_3px_hsl(60,100%,0%,0.3)]"
								)}
							>
								<SkeletonTheme
									highlightColor={cnJoin(isDarkMode && "#1e2021")}
									baseColor={cnJoin(isDarkMode && "#232628")}
								>
									<div>
										<Skeleton className="block h-[180px] w-full rounded-[8px_8px_0_0]" />
									</div>

									<div className="px-[14px] pb-[10px]">
										<header className="flex items-center justify-between gap-[10px]">
											<Skeleton count={2} width={148} height={6} />
											<span>
												<Skeleton width={58} height={23} />
											</span>
										</header>
										<p className="mt-[20px]">
											<Skeleton className="gap-[30px]" count={3} width={"93%"} height={6} />
										</p>
										<p className="mt-[20px]">
											<Skeleton className="gap-[13px]" count={3} width={"93%"} height={6} />
										</p>
										<div className="mt-[10px] flex items-center gap-[13px]">
											<Skeleton width={75} height={19} />
											<Skeleton width={34} height={18} />
										</div>
										<Skeleton
											className="mt-[20px] rounded-[8px] p-[10px_12px]"
											width={97}
											height={35}
										/>
									</div>
								</SkeletonTheme>
							</li>
						)}
					/>
				</article>
			</section>
		),

		productItemPage: () => (
			<section className="p-[10px_20px_30px] lg:pt-[30px]">
				<div
					className="mt-[30px] flex flex-col items-center gap-[40px] overflow-hidden md:mt-[45px]
						md:h-[470px] md:flex-row md:items-start md:justify-around md:px-[10px] lg:mt-[60px]
						lg:flex-row lg:gap-[80px]"
				>
					<SkeletonTheme
						highlightColor={cnJoin(isDarkMode && "#1e2021")}
						baseColor={cnJoin(isDarkMode && "#232628")}
					>
						<Skeleton className="h-[350px] w-[400px] md:h-[470px] lg:min-w-[500px]" />
						<Skeleton className="h-[470px] w-[460px] max-md:mx-auto" />
					</SkeletonTheme>
				</div>
			</section>
		),
	};

	return SKELETON_LOOKUP[variant]();
}

export { LoadingSkeleton };
