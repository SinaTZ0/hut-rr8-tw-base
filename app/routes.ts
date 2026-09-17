import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("new-homepage", "routes/new_homepage/new-homepage.tsx"),
] satisfies RouteConfig;
