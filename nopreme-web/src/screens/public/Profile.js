import React from "react";
import styled from "styled-components";
import { graphql, createFragmentContainer } from "react-relay";

const Window = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: column;
  padding: 16px;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 16px;
`;

const Text = styled.div`
  font-size: 1.2em;
  font-weight: bold;
`;

const Gap = styled.div`
  width: 10px;
  height: 10px;
`;

const Img = styled.img`
  border-radius: 20px;
  width: 130px;
  height: 130px;
  filter: brightness(95%);
`;

const Circle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: gray;
`;

function Profile({ router, match, profile }) {
  const { userId } = match.routeParams;
  const { user, collections } = profile;
  return (
    <Window>
      <Row>
        <Circle />
        <Gap />
        <Text style={{ fontSize: 20 }}>{user.name}</Text>
      </Row>

      {collections.edges.map(({ node: { fulfilled, goods } }) => (
        <Row
          key={goods.goodsId}
          onClick={() => {
            router.push(`/profile/${userId}/goods/${goods.goodsId}`);
          }}
        >
          <Img src={goods.img.src} />
          <Gap />
          <Stack>
            <Text>{goods.type}</Text>
            <Text>{goods.name}</Text>
            <Text>{fulfilled}</Text>
            <Text>{goods.numItems} 종</Text>
          </Stack>
        </Row>
      ))}
    </Window>
  );
}

export default createFragmentContainer(Profile, {
  profile: graphql`
    fragment Profile_profile on Profile {
      id
      user {
        id
        userId
        name
      }
      collections(
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "Profile_collections") {
        edges {
          node {
            id
            collecting
            fulfilled
            goods {
              id
              goodsId
              name
              img {
                id
                src
              }
              type
              numItems
            }
          }
        }
      }
    }
  `,
});
