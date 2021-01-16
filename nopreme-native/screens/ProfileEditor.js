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

import Stack from "../components/Stack";
import ProfilePhoto from "../components/ProfilePhoto";
import ModifyUserMutation from "../relay/mutations/ModifyUserMutation";
import { getToken } from "../utils/token";

function ProfileEditor({ relay, navigation, route, viewer }) {
  const window = useWindowDimensions();

  const initialName = viewer.viewer.name;
  const initialProfile = viewer.viewer.profile?.src;

  const [name, setName] = useState(initialName);
  const image = route.params?.image ?? { uri: initialProfile };

  function isEdited() {
    return name !== initialName || image.uri !== initialProfile;
  }

  async function updateProfile() {
    const formData = new FormData();

    formData.append("file", {
      uri: image.uri,
      type: "image/png",
      name: "profile.png",
    });

    // TODO: host as env
    const resp = await fetch("http://192.168.0.3:4000/user-upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    if (resp.ok) {
      const { imageId } = await resp.json();

      // TODO: back
      await ModifyUserMutation.commit(relay.environment, {
        name,
        profile: imageId,
      });

      navigation.navigate("ProfileHome");
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: "프로필 편집",
      headerBackImage: ({ tintColor }) => (
        <HeaderButton name="md-close" style={{ color: tintColor }} />
      ),
      headerRight: ({ tintColor }) => (
        <HeaderButton
          disabled={!isEdited()}
          name="md-checkmark"
          style={{ color: tintColor }}
          onPress={updateProfile}
        />
      ),
    });
  }, [name, image]);

  return (
    <ScrollView style={{ width: window.width, backgroundColor: "white" }}>
      <Stack style={{ gap: 20, padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.push("ImagePicker")}>
          <ProfilePhoto editable img={image} />
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
        profile {
          id
          imageId
          src
        }
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
