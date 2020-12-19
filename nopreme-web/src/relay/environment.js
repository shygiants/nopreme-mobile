import { Environment, RecordSource, Store } from "relay-runtime";
import {
  RelayNetworkLayer,
  urlMiddleware,
  batchMiddleware,
  loggerMiddleware,
  errorMiddleware,
  perfMiddleware,
  retryMiddleware,
  authMiddleware,
  cacheMiddleware,
  progressMiddleware,
  uploadMiddleware,
} from "react-relay-network-modern";
import { v4 as uuidv4 } from "uuid";

import { getToken } from "../utils/token";

const __DEV__ = false;

const store = new Store(new RecordSource());

const network = new RelayNetworkLayer([
  cacheMiddleware({
    size: 100, // max 100 requests
    ttl: 900000, // 15 minutes
  }),
  urlMiddleware({
    url: (req) => Promise.resolve("/graphql"),
  }),
  // batchMiddleware({
  //   batchUrl: (requestList) => Promise.resolve('/graphql/batch'),
  //   batchTimeout: 10,
  // }),
  __DEV__ ? loggerMiddleware() : null,
  __DEV__ ? errorMiddleware() : null,
  __DEV__ ? perfMiddleware() : null,
  retryMiddleware({
    fetchTimeout: 15000,
    retryDelays: (attempt) => Math.pow(2, attempt + 4) * 100, // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
    beforeRetry: ({ forceRetry, abort, delay, attempt, lastError, req }) => {
      if (attempt > 10) abort();
      window.forceRelayRetry = forceRetry;
      console.log(
        "call `forceRelayRetry()` for immediately retry! Or wait " +
          delay +
          " ms."
      );
    },
    statusCodes: [500, 503, 504],
  }),
  authMiddleware({
    token: () => getToken(),
    tokenRefreshPromise: (req) => {
      // TODO: get token
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYmU5NGQyMjQyNjdkZDRjOTQyN2JlYSIsImlhdCI6MTYwNjU2NTM4MywiZXhwIjoxNjA3MTcwMTgzfQ.L6RhNcUoA6o-0Q3WdoK9mwKkb8LwAfg5EEmqIMpczhI";
    },
  }),
  progressMiddleware({
    onProgress: (current, total) => {
      console.log("Downloaded: " + current + " B, total: " + total + " B");
    },
  }),
  uploadMiddleware(),

  // example of the custom inline middleware
  (next) => async (req) => {
    req.fetchOpts.method = "POST"; // change default POST request method to GET
    req.fetchOpts.headers["X-Request-ID"] = uuidv4(); // add `X-Request-ID` to request headers
    req.fetchOpts.credentials = "same-origin"; // allow to send cookies (sending credentials to same domains)
    // req.fetchOpts.credentials = 'include'; // allow to send cookies for CORS (sending credentials to other domains)

    console.log("RelayRequest", req);

    const res = await next(req);
    console.log("RelayResponse", res);

    return res;
  },
]); // as second arg you may pass advanced options for RRNL

export const environment = new Environment({ network, store });
