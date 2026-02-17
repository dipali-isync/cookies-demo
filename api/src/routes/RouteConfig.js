import authRoutes from "./auth/auth.routes.js";

export default function routeConfig(app) {
  authRoutes(app);
}
