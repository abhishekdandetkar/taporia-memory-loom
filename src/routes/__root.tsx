import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-8xl">404</h1>
        <p className="mt-4 text-eyebrow">Page not found</p>
        <p className="mt-6 text-sm font-light opacity-70">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-tap">Return Home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <p className="text-eyebrow">Something broke</p>
        <h1 className="mt-4 text-display text-4xl">A moment of silence.</h1>
        <p className="mt-6 text-sm font-light opacity-70">
          We couldn't load this page. Please try again.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-tap">
            Try Again
          </button>
          <a href="/" className="btn-tap btn-tap-ghost">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TAPORIA — One Tap To Your Memories" },
      { name: "description", content: "TAPORIA crafts premium memory pendants — handcrafted stainless steel jewelry with a hidden NFC core. One tap to relive your moments." },
      { name: "author", content: "TAPORIA" },
      { property: "og:title", content: "TAPORIA — One Tap To Your Memories" },
      { property: "og:description", content: "Handcrafted wearable keepsakes. Limited Founders Edition." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
