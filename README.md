# FlashcardsFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

## Overview

FlashcardsFrontend is an Angular standalone application for uploading PDF files, generating flashcards, and practicing them in quiz mode.

Main features:

- Email/password and Google authentication with Firebase Auth.
- Protected routes via an auth guard.
- PDF upload flow to a backend API.
- File list preview and random quiz entry.
- Flashcard quiz with flip cards, scoring, and navigation.

## Tech stack

- Angular 21 (standalone components + router)
- Angular SSR (Express server entry available)
- Firebase (client authentication)
- Bootstrap + Bootstrap Icons
- Vitest (unit testing through Angular CLI)

## Application routes

- `/auth` → authentication page
- `/` → home page (protected)
- `/add` → upload page (protected)
- `/quiz/:fileId` → quiz page for a selected file (protected)

Any unknown route redirects to `/`.

## Project structure

Key folders:

- `src/app/pages` → route-level pages (`auth`, `home`, `add`, `quiz`)
- `src/app/components` → reusable UI components (`sidebar`, `upload-container`, `flashcard`, `folder-preview`)
- `src/app/services` → shared services (authentication)
- `src/app/guards` → route guards
- `public/assets` → static images used by the UI

Main app files:

- `src/app/app.config.ts` and `src/app/app.routes.ts` for client configuration and routing
- `src/app/app.config.server.ts`, `src/app/app.routes.server.ts`, `src/main.server.ts`, and `src/server.ts` for SSR/prerender setup

## Current behavior notes

- Home (`/`) shows existing uploaded files and opens quizzes from file previews.
- Add (`/add`) handles PDF upload to the backend.
- Sidebar includes quick navigation and a random quiz action.
- A `FlashcardPreview` page/component exists in the codebase for component preview, but it is not currently registered in the router.

SSR is configured with server output mode, and server routes are currently set to prerender all paths.

## Prerequisites

Before running the app, configure Firebase values in:

- `src/app/firebase.config.ts`

Replace placeholder values (`YOUR_API_KEY`, `YOUR_AUTH_DOMAIN`, etc.) with real project credentials.

The frontend also expects a backend API running on `http://localhost:9090` with endpoints used by the app, including:

- `GET /api/v1/get-files`
- `POST /api/v1/upload-file`
- `POST /api/v1/get-flashcards`

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

You can also run:

```bash
npm start
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

For development watch mode:

```bash
npm run watch
```

To run the generated SSR server after build:

```bash
npm run serve:ssr:FlashcardsFrontend
```

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

or:

```bash
npm test
```

Current tests in the repository are mainly component/guard smoke tests (`should create`) plus the default app spec template.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
