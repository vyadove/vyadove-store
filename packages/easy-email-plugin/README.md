# Easy Email Plugin for Payload CMS

A powerful visual email template editor plugin for Payload CMS that provides an intuitive drag-and-drop interface for creating and managing email templates. This plugin integrates with a separate email editor app (shopnex-email) that runs as an iframe.

## ✨ Features

- 📧 **Visual Email Editor** – Drag-and-drop interface for building email templates
- 🎨 **Rich Components** – Pre-built email components (text, images, buttons, etc.)
- 📱 **Responsive Design** – Create mobile-friendly email templates
- 💾 **Template Management** – Store templates as JSON and HTML
- 🔄 **Real-time Preview** – See changes instantly as you build
- 🚀 **Easy Integration** – Simple plugin setup with Payload CMS
- 🎯 **Type Safe** – Full TypeScript support
- 🖼️ **Iframe-based** – Editor runs in a separate app for better isolation

## 📋 Prerequisites

This plugin requires the **shopnex-email** app to be running. The email editor runs as a separate Next.js application that is embedded via iframe.

### Setting up the Email Editor App

1. **Navigate to the shopnex-email app:**

```bash
cd apps/shopnex-email
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and set your Payload CMS server URL:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

4. **Start the email editor app:**

```bash
pnpm dev
```

The app will run on `http://localhost:3040` by default.

5. **Deploy for production** (optional):

The email editor app can be deployed separately to any static hosting:
- Cloudflare Pages
- Vercel
- Netlify

```bash
pnpm build
```

## 🚀 Installation

Install the plugin in your Payload CMS project:

```bash
npm install @shopnex/easy-email-plugin
# or
pnpm add @shopnex/easy-email-plugin
# or
yarn add @shopnex/easy-email-plugin
```

## 🛠️ Basic Usage

Add the plugin to your Payload configuration:

```ts
import { easyEmailPlugin } from "@shopnex/easy-email-plugin";

export default buildConfig({
    plugins: [
        easyEmailPlugin({
            enabled: true,
        }),
        // ... other plugins
    ],
    // ... rest of config
});
```

## 🔧 Configuration

### Plugin Options

```ts
interface EmailChannelPluginConfig {
    enabled?: boolean;
    collectionOverrides?: Partial<CollectionConfig>;
}
```

### Advanced Configuration

```ts
import { easyEmailPlugin } from "@shopnex/easy-email-plugin";

export default buildConfig({
    plugins: [
        easyEmailPlugin({
            enabled: true,
            collectionOverrides: {
                slug: "custom-email-templates",
                admin: {
                    group: "Marketing",
                    defaultColumns: ["name", "subject", "updatedAt"],
                },
                fields: [
                    {
                        name: "subject",
                        type: "text",
                        required: true,
                    },
                    // Add custom fields here
                ],
            },
        }),
    ],
});
```

## 📚 Collection Structure

The plugin automatically creates an `email-templates` collection with the following fields:

- **name** (text) – Template name
- **html** (textarea) – Generated HTML output (auto-generated, disabled for editing)
- **json** (json) – Template JSON structure for the editor

## 🎨 Email Template Editor

The plugin provides a custom edit view with a visual email editor interface:

1. Navigate to the Email Templates collection in your Payload admin panel
2. Click "Create New" to start building a new template
3. Use the drag-and-drop interface to add and configure email components
4. Preview your email template in real-time
5. Save to generate both JSON and HTML versions

## 🌐 Environment Variables

Configure the iframe origin for the email editor in your Payload CMS project:

```env
# URL for the email editor iframe (required)
# In development:
EASY_EMAIL_IFRAME_ORIGIN=http://localhost:3040

# In production (use your deployed email editor URL):
EASY_EMAIL_IFRAME_ORIGIN=https://email-editor.yourdomain.com
```

**Important:** Make sure the `EASY_EMAIL_IFRAME_ORIGIN` matches the URL where your shopnex-email app is running.

## 🔌 Client Components

The plugin exports client components for custom integrations:

```ts
import { EmailTemplate } from "@shopnex/easy-email-plugin/client";

// Use in your custom views
<EmailTemplate
    html={emailHtml}
    json={templateJson}
    serverURL={payload.config.serverURL}
    templateName="My Template"
    identifier="template-id"
    token={authToken}
    iframeOrigin="http://localhost:3040"
/>
```

## 📦 Package Exports

```ts
// Main plugin export
import { easyEmailPlugin } from "@shopnex/easy-email-plugin";

// Client components (use in admin UI)
import { EmailTemplate, EmailTemplateEditView } from "@shopnex/easy-email-plugin/client";

// Server components (use in backend)
import { ... } from "@shopnex/easy-email-plugin/rsc";
```

## 🎯 Use Cases

- **Transactional Emails** – Order confirmations, shipping notifications
- **Marketing Campaigns** – Newsletters, promotional emails
- **User Communications** – Welcome emails, password resets
- **Event Notifications** – Reminders, updates, alerts

## 🏗️ Architecture

This plugin follows a decoupled architecture:

```
┌─────────────────────┐         ┌─────────────────────┐
│  Payload CMS        │         │  shopnex-email      │
│  (Backend)          │         │  (Email Editor UI)  │
│                     │         │                     │
│  - Plugin           │◄───────►│  - Next.js App      │
│  - Email Templates  │  iframe │  - Easy Email UI    │
│  - Collection       │         │  - Client-side only │
└─────────────────────┘         └─────────────────────┘
```

**Benefits:**
- 🔐 **Better Security** – Editor runs in isolated iframe
- 🚀 **Faster Loading** – Editor can be cached separately
- 📦 **Smaller Bundle** – Email editor code not included in main app
- 🌐 **Flexible Deployment** – Deploy editor to CDN/static hosting

## 🔒 Security

The plugin uses Payload's built-in encryption for authentication tokens when communicating with the email editor iframe. All template data is stored securely in your Payload database.

## 🔧 Troubleshooting

### Email editor not loading

1. Ensure the shopnex-email app is running on the configured port (default: 3040)
2. Check that `EASY_EMAIL_IFRAME_ORIGIN` environment variable is set correctly
3. Verify the iframe origin matches the actual URL of your email editor app

### Connection errors

1. Make sure `NEXT_PUBLIC_SERVER_URL` in shopnex-email/.env points to your Payload CMS server
2. Check for CORS issues if running on different domains in production
3. Ensure your Payload CMS server is accessible from the email editor app

### Templates not saving

1. Verify database connection in Payload CMS
2. Check browser console for errors
3. Ensure the email-templates collection was created successfully

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the main repository.

## 📄 License

MIT – © 2025 ShopNex.ai

## 🔗 Links

- [Homepage](https://shopnex.ai)
- [Repository](https://github.com/shopnex-ai/shopnex)
- [Documentation](https://shopnex.ai/docs)
- [Issues](https://github.com/shopnex-ai/shopnex/issues)

## 👨‍💻 Author

**Arseniy** – arseniy@shopnex.ai

---

Made with ❤️ by the ShopNex.ai team