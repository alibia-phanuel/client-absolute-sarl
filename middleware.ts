import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|fr|de)/:path*"],
};


// https://claude.ai/chat/e769bf37-903c-4ee7-845e-ac9fa5520cfa