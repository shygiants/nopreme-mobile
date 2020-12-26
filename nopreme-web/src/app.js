import React from "react";
import { render } from "react-dom";
import { createFarceRouter, makeRouteConfig, Route, resolver } from "found";
import { HashProtocol, BrowserProtocol, queryMiddleware } from "farce";

import App from "./screens/App";
import Home from "./screens/Home";
import GetToken from "./screens/GetToken";
import SignIn from "./screens/SignIn";

const Router = createFarceRouter({
  historyProtocol: new HashProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: makeRouteConfig(
    <Route path="/" Component={App}>
      <Route Component={Home} />
      <Route path="signIn" Component={SignIn} />
      <Route path="getToken" Component={GetToken} />
    </Route>
  ),
});

render(<Router resolver={resolver} />, document.getElementById("root"));
