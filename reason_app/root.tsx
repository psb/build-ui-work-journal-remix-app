import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import "@app/tailwind.css";
import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { destroySession, getSession } from "./session";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/fonts/inter/inter.css" },
];

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return {
    session: session.data,
  };
}

export default function App() {
  let { session } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="mx-auto max-w-xl p-4 lg:max-w-7xl">
        <header>
          <div className="flex items-center justify-between lg:border-b lg:border-gray-800 lg:pb-5 lg:pt-2 ">
            <p className="text-sm uppercase lg:text-lg">
              <span className="text-gray-500">Luke</span>
              <span className="font-semibold text-gray-200">Skywalker</span>
            </p>

            <div className="text-sm font-medium text-gray-500 hover:text-gray-200 lg:text-lg">
              {session.isAdmin ? (
                <Form method="post">
                  <button>Log out</button>
                </Form>
              ) : (
                <Link to="/login">
                  <button>Log in</button>
                </Link>
              )}
            </div>
          </div>

          <div className="my-20 lg:my-28">
            <div className="text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-white lg:text-7xl">
                <Link to="/">Work Journal</Link>
              </h1>
              <p className="mt-2 tracking-tight text-gray-500 lg:mt-4 lg:text-2xl">
                Doings and learnings. Updated weekly.
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <p className="text-3xl">Whoops</p>
        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} - {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p>{error.message}</p>
        ) : (
          <p>Something happened.</p>
        )}
        <Scripts />
      </body>
    </html>
  );
}
