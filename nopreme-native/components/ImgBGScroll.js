import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

import Image from "../components/Image";
import HeaderButton from "../components/HeaderButton";

const BORDER_RADIUS = 40;

const styles = StyleSheet.create({
  window: { width: "100%", height: "100%" },
  header: { width: "100%" },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 0,
  },
  scroll: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  placeholder: { width: "100%" },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    minHeight: "100%",
  },
});

export default function ImgBGScroll({
  navigation,
  imgSrc,
  headerTitle,
  children,
  onOptionPress,
  refreshing,
  onRefresh,
}) {
  const [imgShown, setImgShown] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);

  const window = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  function setDefaultHeaderOption() {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <HeaderButton
          name="md-ellipsis-vertical-sharp"
          style={{ color: tintColor }}
          onPress={onOptionPress}
        />
      ),
    });
  }

  function setHeaderTransparent() {
    setImgShown(true);
    navigation.setOptions({
      headerTitle: null,
      headerTintColor: "white",
      headerBackground: () => (
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={StyleSheet.compose(styles.header, { height: headerHeight })}
        />
      ),
    });
  }

  function setHeaderSolid() {
    setImgShown(false);
    navigation.setOptions({
      headerTintColor: "#000000",
      headerTitle,
      headerBackground: () => (
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: headerHeight,
          }}
        />
      ),
    });
  }

  useEffect(() => {
    setDefaultHeaderOption();
    setHeaderTransparent();
  }, []);

  return (
    <View style={styles.window}>
      <StatusBar style={imgShown ? "light" : "dark"} />
      <Image
        style={StyleSheet.compose(styles.image, { aspectRatio })}
        src={imgSrc}
      />
      <ScrollView
        style={styles.scroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        onScroll={({
          nativeEvent: {
            contentOffset: { y },
          },
        }) => {
          if (y < 0) {
            // Scroll down
            setAspectRatio(window.width / (window.width - y));
          } else if (y <= window.width - BORDER_RADIUS - headerHeight) {
            // Img shown
            if (!imgShown) {
              setHeaderTransparent();
            }
          } else {
            // Img hidden
            if (imgShown) {
              setHeaderSolid();
            }
          }
        }}
      >
        <View>
          <View
            style={StyleSheet.compose(styles.placeholder, {
              height: window.width - BORDER_RADIUS,
            })}
          />
          <View
            style={StyleSheet.compose(
              styles.container,
              !imgShown && { borderTopLeftRadius: 0, borderTopRightRadius: 0 }
            )}
          >
            {children}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
