import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // This function runs after authentication is verified
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/essays/:path*", "/essay/:path*", "/dashboard/:path*"],
};
