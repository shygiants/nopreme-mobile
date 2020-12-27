import React from "react";
import { graphql, createFragmentContainer } from "react-relay";

function Goods({ profile }) {
  return JSON.stringify(profile);
}

export default createFragmentContainer(Goods, {
  profile: graphql`
    fragment Goods_profile on Profile
    @argumentDefinitions(goodsId: { type: "ID!" }) {
      id
      goods(goodsId: $goodsId) {
        id
        goodsId
        name
        type
        img {
          id
          src
        }
        event {
          id
          name
        }
        width
        height
      }
      items(
        goodsId: $goodsId
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "Goods_items", filters: ["goodsId"]) {
        edges {
          node {
            id
            itemId
            artist {
              id
              name
            }
            idx
            img {
              id
              src
            }
          }
        }
      }
      collection(goodsId: $goodsId) {
        id
        collecting
        wishes(
          first: 2147483647 # max GraphQLInt
        ) @connection(key: "Goods_wishes") {
          edges {
            node {
              id
              item {
                id
                itemId
                img {
                  id
                  src
                }
                artist {
                  id
                  name
                }
                idx
              }
              num
              fulfilled
            }
          }
        }
        posessions(
          first: 2147483647 # max GraphQLInt
        ) @connection(key: "Goods_posessions") {
          edges {
            node {
              id
              item {
                id
                itemId
                artist {
                  id
                  name
                }
                idx
                img {
                  id
                  src
                }
              }
              num
              wished
            }
          }
        }
      }
    }
  `,
});
