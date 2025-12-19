import type { HelmetOptions } from "helmet";

const helmetOptions = {
	contentSecurityPolicy: {
		directives: {
			connectSrc: ["'self'"],
			defaultSrc: "'self'",
			frameAncestors: ["'none'"],
			imgSrc: ["'self'", "https://res.cloudinary.com", "data:"],
			upgradeInsecureRequests: "'self'",
		},

		useDefaults: true,
	},

	// X-Frame-Options header to prevent clickjacking
	frameguard: { action: "deny" },

	// Strict-Transport-Security (HSTS) header for HTTPS enforcement
	hsts: { includeSubDomains: true, maxAge: 31536000, preload: true },

	// Referrer-Policy header
	referrerPolicy: { policy: "same-origin" },

	// X-XSS-Protection header to enable browser's built-in XSS protection
	xssFilter: true,
} satisfies HelmetOptions;

export { helmetOptions };
