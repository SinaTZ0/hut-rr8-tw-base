import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("complaints-and-feedback", "routes/complaints-and-feedback/complaints-and-feedback.tsx"),
  route("online-consultation", "routes/online-consultation/online-consultation.tsx"),
  route("altcha/challenge", "routes/altcha-challenge.ts"),
  route("rpc/*", "routes/rpc.ts"),
] satisfies RouteConfig;
