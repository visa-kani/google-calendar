import {
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./layout";

// Root route
const rootRoute: any = createRootRoute({
  component: Layout,
});

// Create route tree
const routeTree = rootRoute.addChildren([]);

// Create and export router
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {},
});
