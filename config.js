// config.js - Enhanced configuration for your redirect page
// This file can be edited manually or through the admin panel (admin.html)

const CONFIG = {
    // Basic redirect settings
    REDIRECT_URL: "https://www.google.com", // The URL where users will be redirected
    REDIRECT_DELAY_MS: 2000, // Delay in milliseconds before redirection (e.g., 2000 for 2 seconds)
    REDIRECT_MESSAGE: "Redirecting you shortly...", // Message shown to users while waiting
    PAGE_TITLE: "Redirecting...", // Title shown in browser tab

    // Social media Open Graph settings
    OG_TITLE: "Earn $100 daily", // Title for social media sharing
    OG_DESCRIPTION: "Check out this amazing offer and start earning today!", // Description for social media sharing
    OG_IMAGE_URL: "https://i.imghippo.com/files/gbuB7452ddM.png", // Image for social media sharing (absolute URL)
    OG_URL: "https://rajonbd1.github.io/bestone/", // Canonical URL of this page

    // Display settings
    DISPLAY_IMAGE_URL: "https://i.imghippo.com/files/gbuB7452ddM.png", // Image displayed on the page itself (absolute URL)

    // Crawler detection settings
    CRAWLER_DETECTION: {
        facebook: true,  // Detect Facebook/Meta crawlers
        twitter: false,  // Detect Twitter/X crawlers
        linkedin: false, // Detect LinkedIn crawlers
        google: false    // Detect Google crawlers
    },

    // Custom styling
    CUSTOM_CSS: "", // Custom CSS to style the redirect page

    // Security settings
    SECURITY: {
        httpsOnly: false,      // Require HTTPS for redirect URLs
        strictReferrer: false  // Set strict referrer policy
    }
};
