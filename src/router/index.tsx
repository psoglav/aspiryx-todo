import { createBrowserRouter, createHashRouter } from "react-router-dom";

import routes from './routes'

export const router = window.isElectronApp ? createHashRouter(routes) : createBrowserRouter(routes);