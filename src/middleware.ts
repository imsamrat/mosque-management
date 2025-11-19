import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/donors/:path*",
    "/members/:path*",
    "/distribution/:path*",
    "/slideshow/:path*",
    "/houses/:path*",
  ],
};
