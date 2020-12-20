import * as React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import Stack from "./Stack";

const RADIUS = 15;
const LINE_WIDTH = 90;

const ACCENT_COLOR = "#7755CC";
const GREY = "#BBBBBB";
const LIGHT_GREY = "#DDDDDD";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 40,
  },
  circle: {
    width: 2 * RADIUS,
    height: 2 * RADIUS,
    borderRadius: RADIUS,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    borderWidth: 1,
    width: LINE_WIDTH,
    height: 0,
  },
  step: {
    flexDirection: "column",
    height: 2 * RADIUS,
    width: 2 * RADIUS,
    alignItems: "center",
    alignContent: "center",
    overflow: "visible",
  },
  stepText: {
    width: LINE_WIDTH + RADIUS,
    textAlign: "center",
  },
});

const STATUS = {
  PROGRESSED: "progressed",
  CURRENT: "current",
  NOT_PROGRESSED: "not_progressed",
};

function Circle({ number, status }) {
  return (
    <View
      style={StyleSheet.compose(
        styles.circle,
        status === STATUS.PROGRESSED
          ? { borderColor: ACCENT_COLOR, backgroundColor: ACCENT_COLOR }
          : status === STATUS.CURRENT
          ? { borderColor: ACCENT_COLOR }
          : { borderColor: GREY, backgroundColor: LIGHT_GREY }
      )}
    >
      <Text
        style={{
          color:
            status === STATUS.PROGRESSED
              ? "white"
              : status === STATUS.CURRENT
              ? ACCENT_COLOR
              : "black",
          fontWeight: status === STATUS.CURRENT ? "bold" : "normal",
        }}
      >
        {number}
      </Text>
    </View>
  );
}

function Line({ progressed, numSteps }) {
  const window = useWindowDimensions();
  const width = (window.width - numSteps * RADIUS * 2) / numSteps;
  return (
    <View
      style={StyleSheet.compose(styles.line, {
        borderColor: progressed ? ACCENT_COLOR : GREY,
        width,
      })}
    ></View>
  );
}

function Step({ idx, title, status }) {
  return (
    <Stack style={StyleSheet.compose(styles.step, { gap: 4 })}>
      <Circle status={status} number={idx} />
      <Text
        style={StyleSheet.compose(styles.stepText, {
          color:
            status === STATUS.PROGRESSED
              ? "black"
              : status === STATUS.CURRENT
              ? ACCENT_COLOR
              : GREY,
        })}
      >
        {title}
      </Text>
    </Stack>
  );
}

export default function Progress({ steps, currIdx }) {
  let contents = [];

  steps.forEach((step, idx) => {
    if (idx !== 0)
      contents.push(
        <Line
          key={`line-${idx}`}
          progressed={idx <= currIdx}
          numSteps={steps.length}
        />
      );
    contents.push(
      <Step
        key={`step-${idx}`}
        idx={idx + 1}
        title={step}
        status={
          idx < currIdx
            ? STATUS.PROGRESSED
            : idx === currIdx
            ? STATUS.CURRENT
            : STATUS.NOT_PROGRESSED
        }
      />
    );
  });
  return <View style={styles.container}>{contents}</View>;
}
