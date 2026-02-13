import type { CssWithCustomProperties } from "@zayne-labs/toolkit-react/utils";

function TestDynamicTailwind() {
	const dynamicText = "blue"; // pretend this is dynamic
	const dynamicNumber = 45; // pretend this is dynamic

	return (
		<div
			className="w-(--dynamic-width) text-(--dynamic-color)"
			style={
				{
					"--dynamic-color": dynamicText,
					"--dynamic-width": `${dynamicNumber}rem`,
				} satisfies CssWithCustomProperties as CssWithCustomProperties
			}
		>
			<p>Hello World</p>
		</div>
	);
}

export default TestDynamicTailwind;
