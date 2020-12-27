import React from "react";
import { QueryRenderer } from "react-relay";
import { Text, SafeAreaView, ActivityIndicator } from "react-native";

import { environment } from "./environment";
// import { environment } from "./environment-naive";

export function createQueryRenderer(
  RootFragmentComponent,
  query,
  variables = {}
) {
  function ComponentWrapper({ route, ...rest }) {
    return (
      <QueryRenderer
        environment={environment}
        query={query}
        variables={{ ...variables, ...route.params }}
        render={({ error, props }) => {
          if (error) {
            console.error(error);
            return <Text>Error on QueryRenderer!</Text>;
          }
          if (!props) {
            return (
              <SafeAreaView
                style={{ height: "100%", justifyContent: "center" }}
              >
                <ActivityIndicator size="large" />
              </SafeAreaView>
            );
          }

          return <RootFragmentComponent route={route} {...rest} {...props} />;
        }}
      />
    );
  }

  return ComponentWrapper;
}
