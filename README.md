# Vite React TypeScript Starter

This project is a starter template for building web applications with React, TypeScript, and Vite. It comes pre-configured with ESLint, Prettier, Tailwind CSS, and Redux Toolkit for state management, offering a robust and efficient development environment.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [ESLint](#eslint)
  - [Vite](#vite)
  - [Tailwind CSS](#tailwind-css)
- [TypeScript](#typescript)

## Features
- **React 18:** Modern JavaScript library for building user interfaces.
- **TypeScript:** Superset of JavaScript that adds static typing.
- **Vite:** Next-generation frontend tooling for a fast development experience.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Redux Toolkit:** Official, opinionated, batteries-included toolset for efficient Redux development.
- **React Router DOM:** Declarative routing for React.
- **Formik & Yup:** Form management and validation.
- **Axios:** Promise-based HTTP client for the browser and Node.js.
- **Radix UI:** Open-source UI component library for building accessible web applications.
- **ESLint & Prettier:** Code linting and formatting for consistent code style.

## Technologies Used
- React: ^18.3.1
- TypeScript: ^5.5.3
- Vite: ^5.4.2
- Tailwind CSS: ^3.4.1
- Redux Toolkit: ^2.2.1
- React Router DOM: ^6.30.0
- Formik: ^2.4.5
- Yup: ^1.3.3
- Axios: ^1.6.7
- Radix UI: Various components (e.g., react-avatar, react-checkbox, react-dialog, etc.)
- Lucide React: ^0.344.0
- React Icons: ^5.0.1
- date-fns: ^3.3.1
- clsx: ^2.1.0
- class-variance-authority: ^0.7.0
- tailwind-merge: ^2.2.1
- tailwindcss-animate: ^1.0.7
- ESLint: ^9.9.1
- Autoprefixer: ^10.4.18
- PostCSS: ^8.4.35

## Project Structure

The project follows a standard React application structure:

```
src/
├── assets/             # Static assets like images.
├── components/         # Reusable UI components, categorized by feature or type.
│   ├── auth/           # Authentication-related components (login, register, auth modal).
│   ├── layout/         # Layout components (navbar, main layout).
│   ├── ui/             # Shadcn UI components.
│   └── users/          # Components related to user management (tables, forms, filters).
├── hooks/              # Custom React hooks for reusable logic.
├── lib/                # Utility functions and helper modules (e.g., theme provider, general utils).
├── pages/              # Top-level components representing different views/pages of the application.
├── store/              # Redux store setup, including slices for different state domains.
├── types/              # TypeScript type definitions.
├── App.tsx             # Main application component where routing and global providers are set up.
├── main.tsx            # Entry point of the React application.
├── index.css           # Global CSS styles.
└── vite-env.d.ts       # TypeScript declaration file for Vite environment variables.
```

## Installation
To get a local copy up and running, follow these simple steps.

1.  Clone the repository:
    ```bash
    git clone https://github.com/TusharSavaliya987/CRUD-Opration-Demo.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd CRUD-Opration-Demo
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

## Usage
To run the project in development mode:

```bash
npm run dev
# or yarn dev
# or pnpm dev
```

This will start the development server, usually at `http://localhost:3000`.

To build the project for production:

```bash
npm run build
# or yarn build
# or pnpm build
```

This will create a `dist` directory with the production-ready build.

## Configuration

### TypeScript
The project uses TypeScript for type checking. The main configuration is in `tsconfig.app.json` for application-specific settings, and `tsconfig.node.json` for Node.js environment settings (like Vite configuration). Key settings include:
- `target`: `ES2020` for application, `ES2022` for Node.js files.
- `lib`: `ES2020`, `DOM`, `DOM.Iterable` for application.
- `module`: `ESNext` with `bundler` resolution.
- `jsx`: `react-jsx` for React JSX transformation.
- Strict mode and linting rules are enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`).

### ESLint
The project uses ESLint for code linting to maintain code quality and consistency. The configuration is defined in `eslint.config.js`.

### Vite
Vite is used as the build tool. The configuration for Vite is in `vite.config.ts`. This includes React plugin setup and path aliases.

### Tailwind CSS
Tailwind CSS is configured in `tailwind.config.js` for utility-first styling. PostCSS is used to process Tailwind CSS, and its configuration is in `postcss.config.js`.
