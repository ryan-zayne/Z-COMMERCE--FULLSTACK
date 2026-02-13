import { useSearch } from "@zayne-labs/toolkit-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { cnMerge } from "@/lib/utils/cn";
import { useGetAllProducts } from "@/store/react-query/useGetAllProducts";
import { useGlobalStore } from "@/store/zustand/globalStore";
import { Button, type ButtonProps } from "../primitives/button";
import { getElementList } from "../primitives/for";
import { IconBox, type MoniconIconBoxProps } from "../primitives/IconBox";

type SearchFormProps = Pick<ButtonProps, "size" | "theme" | "variant"> & {
	buttonIcon?: MoniconIconBoxProps["icon"];

	classNames?: {
		base?: string;
		btn?: string;
		container?: string;
		dropDown?: string;
		input?: string;
	};

	isSearchShow?: boolean;
	placeholder?: string;
	text?: string;
	type?: "search" | "subscribe";
};

function SearchForm(props: SearchFormProps) {
	const {
		buttonIcon = "bx:search-alt-2",
		classNames,
		isSearchShow,
		type = "search",
		placeholder = type === "search" ? "Search for products..." : "Enter Your Email address...",
		text,
		theme = "secondary",
		variant = "input",
	} = props;

	const { allProductsArray } = useGetAllProducts();

	const isMobile = useGlobalStore((state) => state.isMobile);

	const { data, query, setQuery } = useSearch(allProductsArray, 500);

	useEffect(() => {
		if (!isSearchShow) {
			setQuery("");
		}
	}, [isSearchShow, setQuery]);

	const [SearchItemsList] = getElementList();

	const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

	return (
		<div className={cnMerge("flex justify-center", classNames?.container)}>
			<form
				className={cnMerge("flex w-full items-center", type === "search" && "z-100", classNames?.base)}
			>
				<input
					className={cnMerge(
						`w-full rounded-[25px_0_0_25px] border-y-2 border-l-2 border-secondary
						bg-(--color-body,white) py-[6px] pl-[23px] transition-shadow duration-200
						placeholder:font-medium placeholder:text-placeholder
						focus-within:shadow-[1px_0_10px_2px_var(--color-secondary)]
						max-sm:placeholder:text-[15px]`,
						classNames?.input
					)}
					type={type === "search" ? "search" : "email"}
					name={type}
					placeholder={placeholder}
					value={type === "search" ? query : undefined}
					onChange={type === "search" ? handleQuery : undefined}
				/>
				<Button
					type="button"
					className={cnMerge(
						`h-full min-w-[60px] p-0 text-[18px] transition-[color,scale] duration-300
						hover:bg-primary hover:text-heading active:scale-[1.08]`,
						classNames?.btn
					)}
					variant={variant}
					theme={theme}
				>
					{text ?? <IconBox icon={buttonIcon} />}
				</Button>
			</form>

			{type === "search" && data.length > 0 && query !== "" && (
				<SearchItemsList
					className={cnMerge(
						`absolute top-[81px] z-100 flex max-h-[500px] custom-scrollbar w-[min(100%,400px)]
						flex-col gap-[10px] overflow-y-auto rounded-[10px] bg-body px-[20px] text-[12px]`,
						isMobile && "inset-x-0 mx-auto",
						!isMobile && "top-[81px]"
					)}
					each={data}
					renderItem={(item, index) => (
						<li key={item?.id ?? index}>
							<Link
								to={`/products/${item?.category}/${item?.id}`}
								className="flex items-center rounded-[5px] p-[10px]
									shadow-[0_1px_10px_hsl(0,0%,0%,0.6)] lg:p-[16px]"
							>
								<img
									className="aspect-square w-[50px] rounded-full object-cover"
									src={item?.images[0]}
									width="64"
									alt=""
								/>
								<div className="ml-[10px] font-medium">{item?.title}</div>

								<div className="ml-auto font-semibold">${item?.price}</div>
							</Link>
						</li>
					)}
				/>
			)}
		</div>
	);
}

export { SearchForm };
