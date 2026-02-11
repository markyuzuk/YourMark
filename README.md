h# YourMark.ai

A modern, clean website for YourMark.ai - AI, Design & Management Consulting.

## Features

- **Modern Landing Page**: Beautiful hero section showcasing AI, design, and management consulting services
- **Client Preview Portal**: Secure area for clients to access and preview their website projects
- **Responsive Design**: Fully responsive across all devices
- **Modern UI**: Built with React, TailwindCSS, and custom UI components
- **Fast Performance**: Powered by Vite for lightning-fast development and builds

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
MyMark/
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   └── Navbar.jsx   # Navigation component
│   ├── pages/
│   │   ├── LandingPage.jsx    # Main landing page
│   │   └── ClientPortal.jsx   # Client preview portal
│   ├── lib/
│   │   └── utils.js     # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Client Portal Access

The client portal is accessible at `/client-portal`. For demo purposes, use access code: `demo123`

## Customization

### Colors

Edit the CSS variables in `src/index.css` to customize the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Services

Update the services array in `src/pages/LandingPage.jsx` to modify the services section.

### Client Projects

Update the `demoProjects` array in `src/pages/ClientPortal.jsx` to add/modify client project previews.

## License

© 2026 YourMark.ai. All rights reserved.
