import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("altcha/challenge", "routes/altcha-challenge.ts"),
  route("rpc/*", "routes/rpc.ts"),
] satisfies RouteConfig;
