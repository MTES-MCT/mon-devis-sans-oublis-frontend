import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Rediriger /devis/id vers /particulier/devis/id
  if (pathname.match(/^\/devis\/[^\/]+$/)) {
    const url = request.nextUrl.clone();
    url.pathname = `/particulier${pathname}`;
    // Explicitly preserve query parameters
    url.search = search;
    return NextResponse.redirect(url);
  }

  // Rediriger /dossier/id vers /particulier/dossier/id
  if (pathname.match(/^\/dossier\/[^\/]+$/)) {
    const url = request.nextUrl.clone();
    url.pathname = `/particulier${pathname}`;
    // Explicitly preserve query parameters
    url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/devis/:path*", "/dossier/:path*"],
};
