import { css } from "styled-components";

export function edgeStyle(property, value) {
  if (typeof value === "string") {
    return css`
      ${property}: ${value};
    `;
  }

  const { horizontal, vertical, top, bottom, left, right } = value;

  const horizontalVerticalEqual =
    horizontal && vertical && horizontal === vertical;
  const allSidesEqual =
    top && bottom && left && right && ((top === bottom) === left) === right;

  if (horizontalVerticalEqual || allSidesEqual) {
    // since the values will be the same between vertical & horizontal OR
    // left, right, top, & bottom, we can just choose one
    const value = horizontalVerticalEqual ? horizontal : top;
    return css`
      ${property}: ${value};
    `;
  }

  const result = [];

  if (horizontal) {
    result.push(css`
      ${property}-left: ${horizontal};
      ${property}-right: ${horizontal};
    `);
  }
  if (vertical) {
    result.push(css`
      ${property}-top: ${vertical};
      ${property}-bottom: ${vertical};
    `);
  }
  if (top) {
    result.push(css`
      ${property}-top: ${top};
    `);
  }
  if (bottom) {
    result.push(css`
      ${property}-bottom: ${bottom};
    `);
  }
  if (left) {
    result.push(css`
      ${property}-left: ${left};
    `);
  }
  if (right) {
    result.push(css`
      ${property}-right: ${right};
    `);
  }
  if (value.start) {
    result.push(css`
      ${property}-inline-start: ${value.start};
    `);
  }
  if (value.end) {
    result.push(css`
      ${property}-inline-end: ${value.end};
    `);
  }

  return result;
}
