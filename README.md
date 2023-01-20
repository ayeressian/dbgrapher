![NPM](https://img.shields.io/npm/l/db-viewer-component.svg)
![CI](https://github.com/ayeressian/dbgrapher/workflows/CI/badge.svg) 

<img  src="https://raw.githubusercontent.com/ayeressian/dbgrapher/master/apps/main/asset/icon-app.svg"  alt="drawing"  width="200"/>

# DB Grapher
A database schema designing tool that runs in browser. The application URL is [https://dbgrapher.com](https://dbgrapher.com).

## To run
1. Run "npm i".
2. Run "npm run dev".  

## To test
1. Run "npm i" (if you didn't already)
2. Run "npm run test".  

## To test E2E
1. Run "npm i" (if you didn't already)
2. Run "npm run start-and-e2e-main".  

## Folder structure
The application is based on npm workspaces. The main application directory is under apps/main filder. The schema viewer web component is under libs/db-viewer.  

## The main application
The main application is written in [lit](https://lit.dev/) and for state management, [redux-toolkit](https://redux-toolkit.js.org/) has been used. For the build process [vite](https://vitejs.dev/) has been used. For test [vitest](https://vitest.dev/) has been used. Currently, the test coverage is not great. For end to end tests, [playwright](https://playwright.dev/) has been used.  

## The DB viewer web component
The DB viewer web component displays the schema information. It uses svg to render the view. It is written in [svelte](https://svelte.dev/). For the build process [vite](https://vitejs.dev/) has been used. For the test [vitest](https://vitest.dev/) has been used.
