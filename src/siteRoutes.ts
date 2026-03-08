export const ROUTES = {
  home: "/",
  news: "/news/",
  gdint: "/model/gdint/",
  chessAi: "/model/chessai/",
  privacyPolicy: "/policies/privacy-policy/",
} as const;

export type RouteId =
  | "home"
  | "news"
  | "gdint"
  | "chessAi"
  | "privacyPolicy"
  | "notFound";

type RouteMatcher = {
  id: Exclude<RouteId, "notFound">;
  test: (pathname: string) => boolean;
};

const ROUTE_MATCHERS: RouteMatcher[] = [
  { id: "home", test: (pathname) => pathname === "/" },
  { id: "news", test: (pathname) => pathname === "/news" || pathname.startsWith("/news/") },
  { id: "gdint", test: (pathname) => pathname === "/model/gdint" || pathname.startsWith("/model/gdint/") },
  { id: "chessAi", test: (pathname) => pathname === "/model/chessai" || pathname.startsWith("/model/chessai/") },
  {
    id: "privacyPolicy",
    test: (pathname) =>
      pathname === "/policies/privacy-policy" ||
      pathname.startsWith("/policies/privacy-policy/"),
  },
];

export function normalizePathname(pathname: string) {
  if (!pathname) {
    return "/";
  }

  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutQuery = withLeadingSlash.split(/[?#]/, 1)[0];
  const compact = withoutQuery.replace(/\/{2,}/g, "/");
  const trimmed = compact.length > 1 ? compact.replace(/\/+$/, "") : compact;

  return (trimmed || "/").toLowerCase();
}

export function resolveRoute(pathname: string): RouteId {
  const normalized = normalizePathname(pathname);
  const matched = ROUTE_MATCHERS.find((route) => route.test(normalized));

  return matched?.id ?? "notFound";
}

export function restoreRedirectedPath() {
  if (typeof window === "undefined") {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const redirectedPath = currentUrl.searchParams.get("__redirect");

  if (!redirectedPath || !redirectedPath.startsWith("/")) {
    return;
  }

  window.history.replaceState(window.history.state, "", redirectedPath);
}
