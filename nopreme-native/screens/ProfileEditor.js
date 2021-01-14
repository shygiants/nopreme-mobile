import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { graphql, createRefetchContainer } from "react-relay";

import { createQueryRenderer } from "../relay";
import HeaderButton from "../components/HeaderButton";
import Icon from "../components/Icon";
import Stack from "../components/Stack";

const styles = StyleSheet.create({
  profilePhotoContainer: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BBBBBB",
  },
  profilePhoto: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    position: "absolute",
  },
  editProfilePhotoBadge: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1 },
  },
});

function ProfilePhoto({ img }) {
  return (
    <View style={styles.profilePhotoContainer}>
      <Icon name="md-person" style={{ size: 50, color: "white" }} />
      <Image style={styles.profilePhoto} source={{ uri: img?.uri }} />
      <View style={styles.editProfilePhotoBadge}>
        <Icon
          name="md-camera"
          style={{
            size: 20,
          }}
        />
      </View>
    </View>
  );
}

function ProfileEditor({ navigation, route, viewer }) {
  const window = useWindowDimensions();
  const [name, setName] = useState(viewer.viewer.name);
  const image = route.params?.image;

  useEffect(() => {
    navigation.setOptions({
      title: "프로필 편집",
      headerBackImage: ({ tintColor }) => (
        <HeaderButton name="md-close" style={{ color: tintColor }} />
      ),
      headerRight: ({ tintColor }) => (
        <HeaderButton
          name="md-checkmark"
          style={{ color: tintColor }}
          onPress={() => console.log("complete")}
        />
      ),
    });
  }, []);

  return (
    <ScrollView style={{ width: window.width, backgroundColor: "white" }}>
      <Stack style={{ gap: 20, padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.push("ImagePicker")}>
          <ProfilePhoto img={image} />
        </TouchableOpacity>

        <Stack style={{ flexDirection: "row", gap: 10 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              paddingVertical: 10,
            }}
          >
            이름
          </Text>
          <TextInput
            clearButtonMode="while-editing"
            maxLength={16} // TODO: Max length of name
            style={{
              fontSize: 16,
              paddingVertical: 8,
              borderBottomWidth: 1,
              flexGrow: 1,
            }}
            value={name}
            onChangeText={setName}
          />
        </Stack>
      </Stack>
    </ScrollView>
  );
}

const FragmentContainer = createRefetchContainer(ProfileEditor, {
  viewer: graphql`
    fragment ProfileEditor_viewer on Viewer {
      id
      viewer {
        id
        userId
        name
      }
    }
  `,
});

export default createQueryRenderer(
  FragmentContainer,
  graphql`
    query ProfileEditorQuery {
      viewer {
        ...ProfileEditor_viewer
      }
    }
  `
);
