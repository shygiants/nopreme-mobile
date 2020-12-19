import React from "react";
import { render } from "react-dom";
import { createFarceRouter, makeRouteConfig, Route, resolver } from "found";
import { HashProtocol, BrowserProtocol, queryMiddleware } from "farce";

import App from "./screens/App";
import Home from "./screens/Home";
import SignIn from "./screens/SignIn";

const Router = createFarceRouter({
  historyProtocol: new HashProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: makeRouteConfig(
    <Route path="/" Component={App}>
      <Route Component={Home} />
      <Route path="signin" Component={SignIn} />
    </Route>
  ),
});

render(<Router resolver={resolver} />, document.getElementById("root"));
