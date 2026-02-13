import { m } from "motion/react";
import { useEffect } from "react";
import { IconBox } from "@/components/primitives/IconBox";
import { Logo } from "@/components/primitives/Logo";
import { Show } from "@/components/primitives/show";
import { DropDown } from "@/components/ui/DropDown";
import { cnJoin } from "@/lib/utils/cn";
import { useGlobalStore } from "@/store/zustand/globalStore";
import { useDropdown } from "../DropDown/dropdown-context";

function FooterDropDowns() {
	const isDesktop = useGlobalStore((state) => state.isDesktop);

	const dropOne = useDropdown();
	const dropTwo = useDropdown();
	const dropThree = useDropdown();
	const dropFour = useDropdown();
	const dropFive = useDropdown();

	const dropdownsArray = [dropOne, dropTwo, dropThree, dropFour, dropFive];

	useEffect(() => {
		if (!isDesktop) return;

		for (const dropdown of dropdownsArray) {
			dropdown.onOpen();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDesktop]);

	useEffect(() => {
		if (isDesktop) return;

		for (const dropdown of dropdownsArray) {
			dropdown.onClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDesktop]);

	const handleDropDowns = (selectedDropdown: ReturnType<typeof useDropdown>) => {
		const onClick = (event: React.MouseEvent) => {
			if (isDesktop) {
				event.preventDefault();
				return;
			}

			for (const dropdown of dropdownsArray) {
				dropdown !== selectedDropdown ? dropdown.onClose() : dropdown.onToggle();
			}
		};

		return onClick;
	};

	const semanticClasses = {
		listContainer: `flex flex-col gap-[10px] pl-[15px] text-[14px] font-light lg:gap-[16px] lg:pl-0 lg:font-normal`,
	};

	return (
		<m.section
			initial={{ opacity: 0, y: 100 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			id="DropDown Section"
			className="flex flex-col gap-[20px] p-[60px_15px_40px] lg:flex-row lg:justify-between
				lg:px-[44px]"
		>
			<article>
				<Logo className={"dark:brightness-[0.8] dark:contrast-[1.8]"} />

				<DropDown.RootProvider value={dropOne} className="mt-[10px]">
					<Show.Root when={!isDesktop}>
						<DropDown.Trigger
							className="flex cursor-pointer items-center justify-between"
							onClick={handleDropDowns(dropOne)}
						>
							<h4 className="text-[15px] font-medium">Contact Us</h4>

							<span
								className={cnJoin(
									"text-[15px] font-extralight transition-transform duration-300",
									dropOne.isOpen && "rotate-180"
								)}
							>
								<IconBox icon="fa6-solid:chevron-down" />
							</span>
						</DropDown.Trigger>
					</Show.Root>

					<DropDown.Content classNames={{ listContainer: semanticClasses.listContainer }}>
						<li className="mt-[10px]">
							<IconBox icon="mdi:map-marker" />
							60, 29th Street, San Francisco, CA 94110, United States of America
						</li>
						<li>
							<IconBox icon="mdi:phone" />
							(+00) 123-456-789
						</li>
						<li>
							<IconBox icon="mdi:email" />
							digitalgenie@company.com
						</li>
					</DropDown.Content>
				</DropDown.RootProvider>

				<DropDown.RootProvider value={dropTwo} className="mt-[20px]">
					<Show.Root when={!isDesktop}>
						<DropDown.Trigger
							className="flex cursor-pointer items-center justify-between"
							onClick={handleDropDowns(dropTwo)}
						>
							<h4 className="text-[15px] font-medium">Follow Us</h4>

							<span
								className={cnJoin(
									"text-[15px] font-extralight transition-transform duration-300",
									dropOne.isOpen && "rotate-180"
								)}
							>
								<IconBox icon="fa6-solid:chevron-down" />
							</span>
						</DropDown.Trigger>
					</Show.Root>

					<DropDown.Content
						classNames={{
							listContainer: `flex items-center gap-[20px] text-[17px] [&_li]:pt-[15px]
							lg:[&_li]:pb-[15px]`,
						}}
					>
						<li>
							<IconBox icon="bi:facebook" />
						</li>
						<li>
							<IconBox icon="bi:twitter" />
						</li>
						<li>
							<IconBox icon="bi:youtube" />
						</li>
						<li>
							<IconBox icon="bi:instagram" />
						</li>
						<li>
							<IconBox icon="bi:pinterest" />
						</li>
					</DropDown.Content>
				</DropDown.RootProvider>
			</article>

			<article>
				<DropDown.RootProvider value={dropThree} className="min-w-[200px]">
					<DropDown.Trigger
						className="flex cursor-pointer items-center justify-between text-[15px] lg:text-primary
							lg:dark:text-heading"
						onClick={handleDropDowns(dropThree)}
					>
						<h4 className="font-medium lg:text-[18px]">Information</h4>

						<Show.Root when={!isDesktop}>
							<span
								className={cnJoin(
									"text-[15px] font-extralight transition-transform duration-300",
									dropThree.isOpen && "rotate-180"
								)}
							>
								<IconBox icon="fa6-solid:chevron-down" />
							</span>
						</Show.Root>
					</DropDown.Trigger>

					<DropDown.Content classNames={{ listContainer: semanticClasses.listContainer }}>
						<li className="mt-[12px] lg:mt-[30px]">About Us</li>
						<li>Contact Us</li>
						<li>Terms & Conditions</li>
						<li>Returns & Exchanges</li>
						<li>Shipping & Delivery</li>
					</DropDown.Content>
				</DropDown.RootProvider>
			</article>

			<article>
				<DropDown.RootProvider value={dropFour} className="min-w-[200px]">
					<DropDown.Trigger
						className="flex cursor-pointer items-center justify-between text-[15px] lg:text-primary
							lg:dark:text-heading"
						onClick={handleDropDowns(dropFour)}
					>
						<h4 className="font-medium lg:text-[18px]">Our Services</h4>

						<Show.Root when={!isDesktop}>
							<span
								className={cnJoin(
									"text-[15px] font-extralight transition-transform duration-300",
									dropOne.isOpen && "rotate-180"
								)}
							>
								<IconBox icon="fa6-solid:chevron-down" />
							</span>
						</Show.Root>
					</DropDown.Trigger>

					<DropDown.Content classNames={{ listContainer: semanticClasses.listContainer }}>
						<li className="mt-[12px] lg:mt-[30px]">Your Account</li>
						<li>Return Center</li>
						<li>Purchase App</li>
						<li>Download</li>
						<li>Latest News</li>
					</DropDown.Content>
				</DropDown.RootProvider>
			</article>

			<article>
				<DropDown.RootProvider value={dropFive} className="min-w-[200px]">
					<DropDown.Trigger
						className="flex cursor-pointer items-center justify-between text-[15px] lg:text-primary
							lg:dark:text-heading"
						onClick={handleDropDowns(dropFive)}
					>
						<h4 className="font-medium lg:text-[18px]">My Account</h4>

						<Show.Root when={!isDesktop}>
							<span
								className={cnJoin(
									"text-[15px] font-extralight transition-transform duration-300",
									dropFive.isOpen && "rotate-180"
								)}
							>
								<IconBox icon="fa6-solid:chevron-down" />
							</span>
						</Show.Root>
					</DropDown.Trigger>

					<DropDown.Content classNames={{ listContainer: semanticClasses.listContainer }}>
						<li className="mt-[12px] lg:mt-[30px]">Order History</li>
						<li>Wishlist</li>
						<li>Contact Us</li>
						<li>About Us</li>
						<li>Our Work</li>
					</DropDown.Content>
				</DropDown.RootProvider>
			</article>
		</m.section>
	);
}

export { FooterDropDowns };
