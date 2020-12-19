import styled from "styled-components";

const color = "palevioletred";

const Button = styled.button`
  width: fit-content;
  background: ${(props) => (props.primary ? props.color || color : "white")};
  color: ${(props) =>
    props.primary ? props.textColor || "white" : props.color || color};

  border-radius: 3px;
  border: 2px solid ${(props) => props.color || color};
  margin: 0;
  padding: 0.25em 1em;
  font-size: 1em;
  :active {
    opacity: 0.5;
  }
  ${(props) => props.disabled && "opacity: 0.5;"}
`;

export default Button;
