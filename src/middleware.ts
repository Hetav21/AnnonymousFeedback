import { stackMiddlewares } from "./lib/stackMiddlewareHandler";
import { redirectBasedOnToken } from "./middlewares/redirectBasedOnToken";

const middlewares = [redirectBasedOnToken];

export const middleware = () =>  {return stackMiddlewares(middlewares);}

export const config = {
  matcher: ["/signin", "/signup", "/", "/dashboard/:path*", "/verify/:path*"],
};