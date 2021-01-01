import React from "react";
import styled, { css } from "styled-components";
import { graphql, createFragmentContainer } from "react-relay";

import Stack from "../../components/Stack";
import Grid from "../../components/Grid";
import Badge from "../../components/Badge";
import ProgressBar from "../../components/ProgressBar";

const Window = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
`;

const ScrollView = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
`;

const BGImage = styled.img`
  width: 100vw;
  height: 100vw;
  filter: brightness(95%);
`;

const ImgPlaceHolder = styled.div`
  height: calc(100vw - 40pt);
`;

const Container = styled.div`
  background-color: white;
  border-radius: 40pt;
  padding: 16pt;
  padding-top: 40pt;
`;

const Text = styled.div`
  font-size: 24pt;
  font-weight: bold;
`;

const SubText = styled.div`
  font-size: 20pt;
  color: #555555;
`;

const Circle = styled.div`
  width: 50pt;
  height: 50pt;
  border-radius: 25pt;
  background-color: gray;
`;

const ItemImg = styled.img`
  border-radius: 12pt;
  filter: brightness(95%);
  width: calc((100vw - (16pt * 4)) / 3);
  height: calc(
    ((100vw - (16pt * 4)) / 3) / ${({ aspectRatio }) => aspectRatio ?? 1}
  );
`;

const ItemImgPadding = styled.div`
  width: calc((100vw - (16pt * 4)) / 3);
  height: calc(
    ((100vw - (16pt * 4)) / 3) / ${({ aspectRatio }) => aspectRatio ?? 1}
  );
`;

function Goods({ profile }) {
  const { goods, user, collection } = profile;

  const aspectRatio = goods.width / goods.height;

  return (
    <Window>
      <BGImage src={goods.img.src} />
      <ScrollView>
        <ImgPlaceHolder />
        <Container>
          <Stack gap={10}>
            <Badge text={goods.type} />
            <Text>{goods.name}</Text>
            <SubText>{goods.event.name}</SubText>
            <Stack
              direction="row"
              gap={10}
              extStyle={css`
                align-items: center;
              `}
            >
              <Circle />
              <Text style={{ fontSize: 20 }}>{user.name}</Text>
            </Stack>
            <Grid gap={16} numCross={3} padding={ItemImgPadding}>
              {collection.wishes.edges.map(({ node: { item } }) => (
                <ItemImg
                  key={item.itemId}
                  src={item.img.src}
                  aspectRatio={aspectRatio}
                />
              ))}
            </Grid>
          </Stack>
        </Container>
      </ScrollView>
    </Window>
  );
}

export default createFragmentContainer(Goods, {
  profile: graphql`
    fragment Goods_profile on Profile
    @argumentDefinitions(goodsId: { type: "ID!" }) {
      id
      user {
        id
        userId
        name
      }
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
