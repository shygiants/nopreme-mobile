import React from "react";
import { render } from "react-dom";
import { createFarceRouter, makeRouteConfig, Route } from "found";
import { HashProtocol, BrowserProtocol, queryMiddleware } from "farce";
import { Resolver } from "found-relay";
import { graphql } from "react-relay";

import App from "./screens/public/App";
import Profile from "./screens/public/Profile";
import Goods from "./screens/public/Goods";
import { environment } from "./relay/publicEnvironment";

const Router = createFarceRouter({
  historyProtocol: new HashProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: makeRouteConfig(
    <Route path="/" Component={App}>
      <Route
        path="/profile/:userId"
        Component={Profile}
        query={graphql`
          query public_Profile_Query($userId: ID!) {
            profile(userId: $userId) {
              ...Profile_profile
            }
          }
        `}
      />
      <Route
        path="/profile/:userId/goods/:goodsId"
        Component={Goods}
        query={graphql`
          query public_Goods_Query($userId: ID!, $goodsId: ID!) {
            profile(userId: $userId) {
              ...Goods_profile @arguments(goodsId: $goodsId)
            }
          }
        `}
      />
    </Route>
  ),
});

render(
  <Router resolver={new Resolver(environment)} />,
  document.getElementById("root")
);
