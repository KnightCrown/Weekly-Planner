# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Set up environment variables:
   
   **For Local Development:**
   ```bash
   # Copy the template file
   cp env.template .env.local
   
   # Edit .env.local with your actual credentials
   # .env.local is ignored by git and safe for local development
   ```
   
   **For Production Deployment:**
   ```bash
   # Copy the template file
   cp env.template .env
   
   # Edit .env with your production credentials
   ```
   
   **Required Environment Variables:**
   ```bash
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   
   To get these values:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project or select an existing one
   - Go to Settings > API
   - Copy the Project URL and anon/public key
   
   **Enable Google OAuth (Required for Sign-in):**
   1. In Supabase Dashboard, go to **Authentication > Providers**
   2. Find **Google** and toggle it **ON**
   3. Set up Google OAuth credentials:
      - Go to [Google Cloud Console](https://console.cloud.google.com/)
      - Create OAuth 2.0 Client ID
      - Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
      - Add local redirect URI: `http://localhost:4028/auth/v1/callback`
   4. Copy Client ID and Client Secret to Supabase Google provider settings
   
   **Security Notes:**
   - `.env.local` is automatically ignored by git (safe for local development)
   - `.env` is also ignored by git (safe for production secrets)
   - Never commit actual API keys to version control
   - Use different Supabase projects for development and production
   
3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
``