const LOGO_URL =
	"https://res.cloudinary.com/djvestif4/image/upload/v1734953321/z-commerce/brand/logo-1x_t3hytw.png";

const RootLayout = (strings: TemplateStringsArray, ...values: unknown[]) => `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Z-Commerce</title>
			<style>
				/* Styles remain the same */
			</style>
		</head>
		<body>
			<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
				<tr>
					<td align="center" style="padding: 48px 20px;">
						<table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation">
							<tr>
								<td align="center">
									<img src="${LOGO_URL}" alt="Z-Commerce" class="logo" />
									${String.raw({ raw: strings }, ...values)}
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>
	</html>
`;

export { RootLayout };
