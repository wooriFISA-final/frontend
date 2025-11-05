# Gemini Code Assistant Context

## Project Overview

This project is a Customer Relationship Management (CRM) dashboard application built with React, TypeScript, and Vite. It uses Material-UI for UI components and Tailwind CSS for styling. The application features a main dashboard, a reports page, a plan page, and a settings page.

## Building and Running

### Prerequisites

- Node.js and npm (or yarn)

### Installation

```bash
npm install
```

### Development

To start the development server, run:

```bash
npm run dev
```

### Build

To build the project for production, run:

```bash
npm run build
```

### Linting

To lint the code, run:

```bash
npm run lint
```

## Development Conventions

### Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI:** Material-UI
- **Styling:** Tailwind CSS
- **Routing:** React Router

### Code Style

The project uses Prettier for code formatting and ESLint for linting. Please ensure that you run `npm run lint` before committing any changes.

### Project Structure

The main application logic is located in the `src` directory. The CRM-specific components and pages are in `src/crm`. The application is structured with a main `App.tsx` that handles routing, and a `CrmDashboard.tsx` that defines the main layout of the CRM application.
