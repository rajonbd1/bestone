# Redirect Page for GitHub Pages

This project provides a simple, configurable HTML page designed for use with GitHub Pages. It allows you to create a social media-friendly link that redirects users to a specified URL after a short delay, while ensuring social media crawlers (like Facebook's) can properly scrape Open Graph (OG) metadata.

## ✨ New: Admin Panel

**🎉 Now includes a powerful web-based admin panel for easy configuration!**

Access the admin panel by opening `admin.html` in your browser to:
- Configure all settings through an intuitive interface
- Preview how your links will look on social media
- Save and manage multiple configuration profiles
- Export/import configurations
- Real-time validation and updates

## Features

- **🎛️ Web Admin Panel:** Easy-to-use interface for all configurations
- **🔄 Configurable Redirect URL:** Easily change where users are redirected
- **📱 Social Media Optimization:** Customize title, description, and image for social sharing
- **🖼️ Display Image:** Show a specific image on the redirect page itself
- **⏱️ Delayed Redirect:** Set custom delay before redirection
- **🤖 Enhanced Crawler Detection:** Support for Facebook, Twitter, LinkedIn, and Google crawlers
- **🎨 Custom Styling:** Add your own CSS for personalized appearance
- **👥 Profile Management:** Save and switch between multiple configurations
- **📤 Export/Import:** Backup and share your configurations
- **🔒 Security Options:** HTTPS enforcement and referrer policies

## Quick Start

### Option 1: Using the Admin Panel (Recommended)

1. **Clone this repository** (or download the files) to your local machine.
2. **Open `admin.html`** in your web browser
3. **Configure your settings** using the intuitive interface:
   - Set your redirect URL and timing
   - Customize social media title, description, and image
   - Choose which crawlers to detect
   - Add custom styling if needed
4. **Click "Save Configuration"** to generate your `config.js` file
5. **Test your setup** using the preview feature

### Option 2: Manual Configuration

1. **Clone this repository** (or download the files) to your local machine.
2. **Edit `config.js`:** Open the `config.js` file in a text editor. This file contains all the configurable options:

    ```javascript
    const CONFIG = {
        REDIRECT_URL: "https://www.example.com/your-destination-page", // The URL where users will be redirected
        OG_TITLE: "Your Awesome Product/Service!", // Title for social media sharing
        OG_DESCRIPTION: "Check out this amazing offer and start earning today!", // Description for social media sharing
        OG_IMAGE_URL: "https://your-domain.com/assets/your-share-image.jpg", // Image for social media sharing (absolute URL)
        DISPLAY_IMAGE_URL: "https://your-domain.com/assets/your-display-image.jpg", // Image displayed on the page itself (absolute URL)
        REDIRECT_DELAY_MS: 2000 // Delay in milliseconds before redirection (e.g., 2000 for 2 seconds)
    };
    ```

    *   **`REDIRECT_URL`**: Change this to the actual URL you want your users to be redirected to.
    *   **`OG_TITLE`**: This is the title that will appear when your link is shared on platforms like Facebook, Twitter, etc.
    *   **`OG_DESCRIPTION`**: This is the description that will appear when your link is shared.
    *   **`OG_IMAGE_URL`**: This is the absolute URL to the image that will be displayed when your link is shared. Make sure this image is publicly accessible.
    *   **`DISPLAY_IMAGE_URL`**: This is the absolute URL to an image that will be displayed directly on the redirect page itself. This can be the same as `OG_IMAGE_URL` or a different one.
    *   **`REDIRECT_DELAY_MS`**: Set the delay in milliseconds before the redirect occurs. For example, `2000` means 2 seconds.

3.  **Prepare your images:** Ensure that the images specified in `OG_IMAGE_URL` and `DISPLAY_IMAGE_URL` are hosted online and are publicly accessible. You can host them within your GitHub repository (e.g., in an `assets` folder) and use their raw GitHub URL, or use any other image hosting service.

## Admin Panel Features

The admin panel (`admin.html`) provides a comprehensive interface for managing your redirect page:

### 🏠 Basic Settings
- **Redirect URL**: Where users will be sent
- **Redirect Delay**: How long to wait (0-60 seconds)
- **Redirect Message**: Custom message shown to users
- **Page Title**: Browser tab title

### 📱 Social Media Settings
- **Social Media Title**: Title when shared (max 60 characters)
- **Social Media Description**: Description when shared (max 160 characters)
- **Social Media Image**: Image for social sharing (1200x630px recommended)
- **Display Image**: Image shown on the redirect page
- **Canonical URL**: The URL of your redirect page

### ⚙️ Advanced Settings
- **Crawler Detection**: Choose which social media crawlers to detect
  - Facebook/Meta crawlers
  - Twitter/X crawlers
  - LinkedIn crawlers
  - Google crawlers
- **Custom CSS**: Add your own styling
- **Security Options**: HTTPS enforcement and referrer policies

### 👥 Profile Management
- **Save Profiles**: Store multiple configurations with custom names
- **Load Profiles**: Quickly switch between saved configurations
- **Profile History**: See when each profile was created

### 📤 Export/Import
- **Export config.js**: Download ready-to-use configuration file
- **Export JSON**: Backup in JSON format
- **Import**: Load previously exported configurations
- **Live Preview**: See generated config.js code in real-time

### 👁️ Social Media Preview
- **Real-time Preview**: See how your link will look when shared
- **Visual Validation**: Ensure images and text display correctly

## Publishing to GitHub Pages

1.  **Create a new GitHub repository** (if you haven't already).

2.  **Push your code** to this new repository. Make sure `index.html`, `config.js`, and any image assets are in the root of your repository.

3.  **Enable GitHub Pages:**
    *   Go to your repository on GitHub.
    *   Click on **Settings**.
    *   In the left sidebar, click on **Pages**.
    *   Under "Build and deployment", for "Source", select **Deploy from a branch**.
    *   For "Branch", select your main branch (usually `main` or `master`) and choose the `/ (root)` folder.
    *   Click **Save**.

4.  **Access your site:** GitHub Pages will build and deploy your site. This usually takes a few minutes. Once deployed, your site will be accessible at a URL like `https://<your-username>.github.io/<your-repository-name>/`.

    This is the URL you should use for your `og:url` in `config.js` if you want it to reflect your GitHub Pages URL.

## How it Works

-   The `index.html` file loads `config.js` to get the configuration values.
-   It uses JavaScript to detect if the visitor is a known social media crawler (e.g., Facebook's `facebookexternalhit`).
-   If it's a crawler, the page **does not redirect**, allowing the crawler to read the Open Graph meta tags in the `<head>` section. This ensures that when your link is shared, the correct title, description, and image are displayed.
-   If it's a regular user, the page waits for the specified `REDIRECT_DELAY_MS` and then redirects the user to the `REDIRECT_URL` using `window.location.replace()`.

This setup allows you to have a custom social media preview for your links while still directing users to your desired destination.
