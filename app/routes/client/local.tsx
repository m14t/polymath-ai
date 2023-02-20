import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async () => {
  // if there is a query param, load it up and return
  return json({
    not: "Yet",
  });
};

function Results(props: { bits: any }) {
  const bits = props.bits;

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {bits.map(
        (
          bit: { text: string; info: { title: any; url: any } },
          index: string
        ) => (
          <li className="flex py-4" key={index}>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 hover:text-indigo-700">
                Text: {bit.text}
              </p>
              <p className="text-sm font-medium text-gray-900 hover:text-indigo-700">
                Source:{" "}
                <a href="{bit?.info?.url}">
                  {bit?.info?.title || bit?.info?.url}
                </a>
              </p>
            </div>
          </li>
        )
      )}
    </ul>
  );
}

export default function ClientLocal(): JSX.Element {
  const { not } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <main className="p-4">
      <h3 className="text-l italic p-2">Local Endpoint Context Client</h3>

      <fetcher.Form method="post" action="/endpoint">
        <div>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="query"
              placeholder="Question here please!"
              defaultValue="How long is a piece of string?"
              id="query"
              className="w-full input-primary"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                id="random-query"
                className="h-5 w-5 text-gray-400 hover:brightness-110 active:brightness-110 hover:cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                />
              </svg>
            </div>
          </div>
          <div className="py-4">
            <button
              id="ask"
              type="submit"
              className="btn-primary disabled:opacity-50"
            >
              Ask Me
            </button>
          </div>
        </div>
      </fetcher.Form>

      {fetcher?.data?.bits && (
        <div id="results" className="py-4 mt-4">
          <h2 className="text-xl font-bold border-b border-indigo-500/30 hover:border-indigo-500/60">
            Context Results
          </h2>
        </div>
      )}
      {fetcher?.data?.bits && <Results bits={fetcher?.data?.bits} />}
    </main>
  );
}