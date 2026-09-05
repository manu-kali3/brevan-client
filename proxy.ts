import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const isProtected = ["/trackbookings", "/bookings", "/dashboard"].some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if ((pathname === "/login" || pathname === "/signup") && user) {
    const url2 = request.nextUrl.clone();
    url2.pathname = "/trackbookings";
    url2.search = "";
    return NextResponse.redirect(url2);
  }
  return response;
}

export const config = {
  matcher: ["/trackbookings/:path*", "/bookings/:path*", "/dashboard/:path*", "/login", "/signup"],
};
