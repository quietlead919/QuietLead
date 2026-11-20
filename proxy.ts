import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const clerk = clerkMiddleware();

// When the site is shown inside the FrameWerk portfolio (an iframe), Clerk's handshake
// redirects to the Clerk domain, which may not be framed, and the window stays white.
// Page requests made for an iframe skip the middleware; the public pages need no session.
export default function proxy(req: NextRequest, ev: NextFetchEvent) {
  if (req.headers.get("sec-fetch-dest") === "iframe") return NextResponse.next();
  return clerk(req, ev);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
