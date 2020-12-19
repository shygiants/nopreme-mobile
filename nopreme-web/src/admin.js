import React from "react";
import { render } from "react-dom";
import { createFarceRouter, makeRouteConfig, Route, Redirect } from "found";
import { HashProtocol, queryMiddleware } from "farce";
import { Resolver } from "found-relay";
import { graphql } from "react-relay";

import App from "./screens/admin/App";
import Home from "./screens/admin/Home";
import GroupEditor from "./screens/admin/GroupEditor";
import ArtistEditor from "./screens/admin/ArtistEditor";
import EventEditor from "./screens/admin/EventEditor";
import GoodsEditor from "./screens/admin/GoodsEditor";
import { environment } from "./relay/environment";

const Router = createFarceRouter({
  historyProtocol: new HashProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: makeRouteConfig(
    <Route path="/" Component={App}>
      <Route
        Component={Home}
        query={graphql`
          query admin_Home_Query {
            admin {
              ...Home_admin
            }
          }
        `}
      />
      <Redirect from="groups/:groupId" to="/groups/:groupId/events" />
      <Route
        path="groups/:groupId/artists"
        Component={GroupEditor}
        query={graphql`
          query admin_GroupEditor_Query($groupId: ID) {
            admin {
              ...GroupEditor_admin @arguments(groupId: $groupId)
            }
          }
        `}
      />
      <Route
        path="groups/:groupId/events"
        Component={ArtistEditor}
        query={graphql`
          query admin_ArtistEditor_Query($groupId: ID!) {
            admin {
              ...ArtistEditor_admin @arguments(artistId: $groupId)
            }
          }
        `}
      />
      <Route
        path="events/:eventId/:artistId"
        Component={EventEditor}
        query={graphql`
          query admin_EventEditor_Query($artistId: ID!, $eventId: ID!) {
            admin {
              ...EventEditor_admin
                @arguments(artistId: $artistId, eventId: $eventId)
            }
          }
        `}
      />
      <Route
        path="goods/:goodsId"
        Component={GoodsEditor}
        query={graphql`
          query admin_GoodsEditor_Query($goodsId: ID!) {
            admin {
              ...GoodsEditor_admin @arguments(goodsId: $goodsId)
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
