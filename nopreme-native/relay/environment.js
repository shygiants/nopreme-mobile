import { Environment, RecordSource, Store } from "relay-runtime";
import {
  RelayNetworkLayer,
  cacheMiddleware,
  urlMiddleware,
  batchMiddleware,
  authMiddleware,
  loggerMiddleware,
  errorMiddleware,
  perfMiddleware,
  retryMiddleware,
  progressMiddleware,
  uploadMiddleware,
} from "react-relay-network-modern";
import { nanoid } from "nanoid/async/index.native";

import { getToken, setToken } from "../utils/token";
import { getHost } from "../utils/url";
import { login } from "../utils/login";

const __DEV__ = false;

const store = new Store(new RecordSource());

const network = new RelayNetworkLayer([
  urlMiddleware({
    url: () => {
      const graphql_url = new URL("graphql", getHost());

      return graphql_url.href;
    },
  }),
  __DEV__ ? loggerMiddleware() : null,
  __DEV__ ? errorMiddleware() : null,
  __DEV__ ? perfMiddleware() : null,
  retryMiddleware({
    fetchTimeout: 15000,
    retryDelays: (attempt) => Math.pow(2, attempt + 4) * 100, // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
    beforeRetry: ({ forceRetry, abort, delay, attempt, lastError, req }) => {
      if (attempt > 10) abort();
      window.forceRelayRetry = forceRetry;
      // console.log('call `forceRelayRetry()` for immediately retry! Or wait ' + delay + ' ms.');
    },
    statusCodes: [500, 503, 504],
  }),
  authMiddleware({
    token: async () => await getToken(),
    tokenRefreshPromise: async (req) => {
      // TODO: get token
      console.log("[client.js] resolve token refresh", req);
      const token = await login();
      await setToken(token);

      return token;
    },
  }),
  progressMiddleware({
    onProgress: (current, total) => {
      console.log("Downloaded: " + current + " B, total: " + total + " B");
    },
  }),
  uploadMiddleware(),
  (next) => async (req) => {
    req.fetchOpts.method = "POST"; // change default POST request method to GET
    // req.fetchOpts.headers['X-Request-ID'] = uuidv4(); // add `X-Request-ID` to request headers
    req.fetchOpts.headers["X-Request-ID"] = await nanoid(); // add `X-Request-ID` to request headers
    req.fetchOpts.credentials = "same-origin"; // allow to send cookies (sending credentials to same domains)
    // req.fetchOpts.credentials = 'include'; // allow to send cookies for CORS (sending credentials to other domains)

    __DEV__ ? console.log("RelayRequest", req) : null;

    const res = await next(req);
    // __DEV__ ? console.log('RelayResponse', res) : null;

    return res;
  },
]);

export const environment = new Environment({
  network,
  store,
});
