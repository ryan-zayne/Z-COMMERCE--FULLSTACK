import { RootLayout } from "./layouts/root";
import type { VerifyEmailData } from "./types";

const colors = {
	dark: {
		background: "linear-gradient(135deg, hsl(240, 6%, 7%) 0%, hsl(240, 6%, 12%) 100%)",
		borderColor: "hsl(212, 8%, 64%)",
		buttonGradient: "linear-gradient(to right, hsl(43, 67%, 50%), hsl(43, 91%, 25%))",
		cardBackground:
			"linear-gradient(135deg, hsla(215, 17%, 25%, 0.2) 0%, hsla(215, 17%, 25%, 0.1) 100%)",
		headerText: "hsl(43, 67%, 50%)",
		labelText: "hsl(34, 10%, 58%)",
		text: "hsl(34, 5%, 71%)",
	},
	light: {
		background: "linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsl(214, 32%, 91%) 100%)",
		borderColor: "hsl(214, 32%, 91%)",
		buttonGradient: "linear-gradient(to right, hsl(43, 100%, 55%), hsl(43, 100%, 65%))",
		cardBackground:
			"linear-gradient(135deg, hsla(215, 19%, 35%, 0.1) 0%, hsla(215, 19%, 35%, 0.05) 100%)",
		headerText: "hsl(43, 100%, 55%)",
		labelText: "hsl(0, 0%, 45%)",
		text: "hsl(212, 11%, 23%)",
	},
};

const verifyEmail = (data: VerifyEmailData) => {
	const theme = colors.dark;

	return RootLayout`
		<div
			style="
      background: ${theme.background};
      color: ${theme.text};
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    "
		>
			<h1
				style="
        font-size: 40px;
        font-weight: 700;
        margin: 0 0 32px;
        text-align: center;
        background: linear-gradient(to right, hsl(199, 89%, 48%), hsl(223, 100%, 38%));
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        padding: 8px 16px;
        display: block;
        border-radius: 8px;
      "
			>
				Welcome to DigitalGenie!
			</h1>

			<p
				style="
        font-size: 18px;
        line-height: 1.6;
        margin: 24px 0;
        color: ${theme.text};
      "
			>
				Hey ${data.name},
			</p>

			<p
				style="
        font-size: 18px;
        line-height: 1.6;
        margin: 24px 0;
        color: ${theme.text};
      "
			>
				Thanks for choosing DigitalGenie! We're here to make your wishes for amazing products come
				true. Let's start by verifying your email address so you can explore everything we have in
				store.
			</p>

			<div
				style="
        background: ${theme.cardBackground};
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 24px;
        margin: 32px 0;
        border: 1px solid ${theme.borderColor};
      "
			>
				<h2
					style="
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 20px;
          color: ${theme.headerText};
          text-align: center;
        "
				>
					Your Wishes Await
				</h2>

				<table style="width: 100%; border-spacing: 0; border-collapse: separate;">
					<tr>
						<td style="padding: 0 0 20px;">
							<table style="width: 100%; border-spacing: 0;">
								<tr>
									<td style="width: 24px; vertical-align: middle; padding-right: 12px;">
										<span style="font-size: 18px; display: inline-block;">✨</span>
									</td>
									<td style="vertical-align: middle;">
										<span style="font-size: 16px; color: ${theme.text};">Verify your email</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td style="padding: 0 0 20px;">
							<table style="width: 100%; border-spacing: 0;">
								<tr>
									<td style="width: 24px; vertical-align: middle; padding-right: 12px;">
										<span style="font-size: 18px; display: inline-block;">🎯</span>
									</td>
									<td style="vertical-align: middle;">
										<span style="font-size: 16px; color: ${theme.text};">Personalize your wishlist</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td style="padding: 0 0 20px;">
							<table style="width: 100%; border-spacing: 0;">
								<tr>
									<td style="width: 24px; vertical-align: middle; padding-right: 12px;">
										<span style="font-size: 18px; display: inline-block;">🔍</span>
									</td>
									<td style="vertical-align: middle;">
										<span style="font-size: 16px; color: ${theme.text};">Discover our curated collections</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td style="padding: 0;">
							<table style="width: 100%; border-spacing: 0;">
								<tr>
									<td style="width: 24px; vertical-align: middle; padding-right: 12px;">
										<span style="font-size: 18px; display: inline-block;">⭐</span>
									</td>
									<td style="vertical-align: middle;">
										<span style="font-size: 16px; color: ${theme.text};">Make your first wish come true</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>

			<div style="text-align: center; margin: 40px 0;">
				<a
					href="${data.verificationLink}"
					style="
             display: inline-block;
             background: ${theme.buttonGradient};
             color: ${theme.text};
             padding: 16px 40px;
             border-radius: 12px;
             font-size: 20px;
             font-weight: 600;
             text-decoration: none;
             text-transform: uppercase;
             letter-spacing: 0.05em;
             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
             transition: all 0.3s ease;
           "
				>
					Grant Access
				</a>
			</div>

			<p
				style="
        font-size: 16px;
        color: ${theme.labelText};
        text-align: center;
        margin: 32px 0;
      "
			>
				Or copy this link to your browser:<br />
				<span
					style="
          color: ${theme.headerText};
          word-break: break-all;
          display: inline-block;
          margin-top: 8px;
        "
					>${data.verificationLink}</span
				>
			</p>

			<div
				style="
        margin-top: 48px;
        padding-top: 32px;
        border-top: 1px solid ${theme.borderColor};
        text-align: center;
        color: ${theme.labelText};
      "
			>
				<p style="margin: 16px 0;">This link works its magic for 20 minutes.</p>
				<p style="margin: 16px 0;">
					Didn't sign up for DigitalGenie?<br />
					No worries - just ignore this email.
				</p>
				<p
					style="
          font-size: 14px;
          margin: 32px 0;
          color: ${theme.text};
        "
				>
					DigitalGenie - Where wishes meet reality <br />
					Need help? Our genies are here for you.
				</p>

				<div
					style="
          font-size: 14px;
          color: ${theme.labelText};
          margin-top: 32px;
        "
				>
					<p style="margin: 8px 0;">
						Sent to <span style="color: ${theme.headerText};">${data.email}</span>
						for your DigitalGenie wishlist
					</p>
					<p style="margin: 8px 0;"> ${new Date().getFullYear()} DigitalGenie</p>
				</div>
			</div>
		</div>
	`;
};

export { verifyEmail };
