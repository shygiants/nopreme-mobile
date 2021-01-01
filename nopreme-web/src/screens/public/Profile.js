import React from "react";
import styled, { css } from "styled-components";
import { graphql, createFragmentContainer } from "react-relay";

import ProgressBar from "../../components/ProgressBar";
import Badge from "../../components/Badge";
import Stack from "../../components/Stack";

const Window = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: column;
`;

const Padded = styled.div`
  padding: 16pt;
`;

const Circle = styled.div`
  width: 100pt;
  height: 100pt;
  border-radius: 50pt;
  background-color: gray;
`;

const Img = styled.img`
  border-radius: 20pt;
  width: 130pt;
  height: 130pt;
  filter: brightness(95%);
`;

const Text = styled.div`
  font-size: 16pt;
  font-weight: bold;
`;

const SubText = styled.div`
  font-size: 12pt;
  font-weight: bold;
  color: #555555;
`;

const MiniProgressStyle = css`
  font-size: 12pt;
  padding-top: 3pt;
  padding-bottom: 3pt;
  padding-left: 11pt;
  padding-right: 11pt;
`;

function Profile({ router, match, profile }) {
  const { userId } = match.routeParams;
  const { user, collections } = profile;
  return (
    <Window>
      <Padded>
        <Stack gap={16}>
          <Stack
            flexDirection="row"
            gap={10}
            extStyle={css`
              align-items: center;
            `}
          >
            <Circle />
            <Text style={{ fontSize: 20 }}>{user.name}</Text>
          </Stack>
          {collections.edges.map(({ node: { fulfilled, goods } }) => (
            <Stack
              key={goods.goodsId}
              flexDirection="row"
              gap={10}
              extStyle={css`
                align-items: center;
              `}
              onClick={() => {
                router.push(`/profile/${userId}/goods/${goods.goodsId}`);
              }}
            >
              <Img src={goods.img.src} />

              <Stack
                gap={4}
                extStyle={css`
                  flex-grow: 1;
                `}
              >
                <Badge text={goods.type} />

                <Text>{goods.name}</Text>
                <ProgressBar
                  progress={fulfilled}
                  extTextStyle={MiniProgressStyle}
                />
                <SubText>{goods.numItems} 종</SubText>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Padded>
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
