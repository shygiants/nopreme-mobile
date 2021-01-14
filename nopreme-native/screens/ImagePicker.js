import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaskedView from "@react-native-community/masked-view";
import {
  PinchGestureHandler,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import * as ImageManipulator from "expo-image-manipulator";

import HeaderButton from "../components/HeaderButton";
import Grid from "../components/Grid";

const styles = StyleSheet.create({});

function clip(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

const DURATION = 150;
const defaultAnimOpt = {
  useNativeDriver: false,
  duration: DURATION,
};

function CircleMask({ children }) {
  const window = useWindowDimensions();

  return (
    <MaskedView
      style={{ width: window.width, aspectRatio: 1 }}
      maskElement={
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: window.width,
              aspectRatio: 1,
              borderRadius: window.width / 2,

              backgroundColor: "black",
              borderColor: "white",
            }}
          />
        </View>
      }
    >
      {children}
    </MaskedView>
  );
}

function CropFrame({ image, pan, baseScale }) {
  const window = useWindowDimensions();

  // Handlers
  const imagePinch = useRef(null);
  const imagePan = useRef(null);

  // Transforms
  //   const pan = useRef(new Animated.ValueXY()).current;
  //   const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const scale = Animated.multiply(baseScale, pinchScale);

  const isLandscape = image.width > image.height;
  const windowSize = window.width;
  const imgScale = windowSize / (isLandscape ? image.height : image.width);
  const xMovingSpace = isLandscape ? image.width * imgScale - windowSize : 0;
  const yMovingSpace = isLandscape ? 0 : image.height * imgScale - windowSize;

  function getRanges(scale) {
    const currScale = scale ?? baseScale._value;
    const xPadding = (image.width * imgScale * (currScale - 1)) / 2;
    const yPadding = (image.height * imgScale * (currScale - 1)) / 2;
    const xRange = [-(xPadding + xMovingSpace), xPadding];
    const yRange = [-(yPadding + yMovingSpace), yPadding];

    return { xRange, yRange };
  }

  useEffect(() => {
    // Reset scale
    baseScale.setValue(1);

    // Reset pan center
    pan.setValue({
      x: -(xMovingSpace / 2),
      y: -(yMovingSpace / 2),
    });
  }, [image]);

  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    {
      useNativeDriver: false,
    }
  );
  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    {
      useNativeDriver: false,
    }
  );

  function onPanStateChange(event) {
    if (event.nativeEvent.oldState === State.BEGAN) {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    } else if (event.nativeEvent.oldState === State.ACTIVE) {
      pan.flattenOffset();

      const {
        xRange: [xmin, xmax],
        yRange: [ymin, ymax],
      } = getRanges();
      Animated.timing(pan, {
        toValue: {
          x: clip(pan.x._value, xmin, xmax),
          y: clip(pan.y._value, ymin, ymax),
        },
        ...defaultAnimOpt,
      }).start();
    }
  }

  function onPinchStateChange(event) {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const targetScale = clip(
        baseScale._value * event.nativeEvent.scale,
        1,
        1 / imgScale
      );

      const {
        xRange: [xmin, xmax],
        yRange: [ymin, ymax],
      } = getRanges(targetScale);

      Animated.parallel([
        Animated.timing(baseScale, {
          toValue: targetScale,
          ...defaultAnimOpt,
        }),
        Animated.timing(pinchScale, {
          toValue: 1,
          ...defaultAnimOpt,
        }),
        Animated.timing(pan, {
          toValue: {
            x: clip(pan.x._value, xmin, xmax),
            y: clip(pan.y._value, ymin, ymax),
          },
          ...defaultAnimOpt,
        }),
      ]).start();
    }
  }

  return (
    <PanGestureHandler
      ref={imagePan}
      simultaneousHandlers={imagePinch}
      onGestureEvent={onPanEvent}
      onHandlerStateChange={onPanStateChange}
    >
      <Animated.View>
        <PinchGestureHandler
          ref={imagePinch}
          simultaneousHandlers={imagePan}
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}
        >
          <Animated.View>
            <CircleMask>
              <Animated.Image
                source={{ uri: image.uri }}
                style={{
                  [isLandscape ? "height" : "width"]: window.width,
                  aspectRatio: image.width / image.height,
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { scale },
                  ],
                }}
              />
            </CircleMask>
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

function AssetsGridList({ onImageSelect }) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    MediaLibrary.getAssetsAsync().then(({ assets }) => {
      setAssets(assets);
      onImageSelect(assets[0]);
    });
  }, []);

  async function loadMore() {
    setLoading(true);
    const res = await MediaLibrary.getAssetsAsync({
      after: assets[assets.length - 1].id,
    });

    setAssets(assets.concat(res.assets));
    setLoading(false);
  }

  return assets ? (
    <ScrollView
      style={{
        backgroundColor: "white",
        width: window.width,
        height: window.height - window.width - insets.top - insets.bottom - 10,
      }}
      scrollEventThrottle={16}
      onScroll={async ({ nativeEvent }) => {
        if (loading) return;
        const { layoutMeasurement, contentSize, contentOffset } = nativeEvent;
        const padding = 30;

        const scrollEnd =
          contentOffset.y + layoutMeasurement.height >
          contentSize.height - padding;

        if (scrollEnd) await loadMore();
      }}
    >
      <Grid
        numCross={3}
        style={{ gap: 4 }}
        padding={() => (
          <View style={{ width: (window.width - 4 * 4) / 3, aspectRatio: 1 }} />
        )}
      >
        {assets.map(({ uri, id }, idx) => (
          <Pressable key={id} onPress={() => onImageSelect(assets[idx])}>
            <Image
              source={{ uri }}
              style={{ width: (window.width - 4 * 4) / 3, aspectRatio: 1 }}
            />
          </Pressable>
        ))}
      </Grid>
    </ScrollView>
  ) : (
    <ActivityIndicator size="large" />
  );
}

export default function ImagePicker({ navigation }) {
  const window = useWindowDimensions();

  const [image, setImage] = useState(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const baseScale = useRef(new Animated.Value(1)).current;

  async function cropImage() {
    const isLandscape = image.width > image.height;
    const windowSize = window.width;
    const imgScale = windowSize / (isLandscape ? image.height : image.width);

    const currScale = baseScale._value;
    const xPadding = (image.width * imgScale * (currScale - 1)) / 2;
    const yPadding = (image.height * imgScale * (currScale - 1)) / 2;

    const originX = (-pan.x._value + xPadding) / imgScale / currScale;
    const originY = (-pan.y._value + yPadding) / imgScale / currScale;
    const width = windowSize / imgScale / currScale;
    const height = windowSize / imgScale / currScale;

    const cropped = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ crop: { originX, originY, width, height } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    navigation.navigate("ProfileEditor", { image: cropped });
  }

  useEffect(() => {
    navigation.setOptions({
      title: "이미지 선택",
      headerRight: ({ tintColor }) => (
        <HeaderButton
          name="md-checkmark"
          style={{ color: tintColor }}
          onPress={cropImage}
        />
      ),
    });
  }, [image]);

  return (
    <View>
      {image && <CropFrame image={image} pan={pan} baseScale={baseScale} />}
      <AssetsGridList onImageSelect={setImage} />
    </View>
  );
}
