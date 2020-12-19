import React, { useRef, useState } from "react";
import styled from "styled-components";

import Button from "./Button";
import Image from "./Image";
import { getToken } from "../utils/token";

const StyledFileInput = styled.input.attrs((props) => ({
  type: "file",
  accept: "image/png, image/jpeg",
}))`
  display: none;
`;

export default function ImageInput({ onChange, value: { src } }) {
  const inputRef = useRef(null);

  async function onSelectFile({ target: { files } }) {
    const formData = new FormData();
    const imgFile = files[0];

    formData.append("file", imgFile);
    const resp = await fetch("/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });
    if (resp.ok) {
      const { imageId, src } = await resp.json();

      onChange({ imageId, src });
    }
    // TODO: Handle error
  }

  return (
    <div>
      {src && <Image height="100px" src={src} />}
      <StyledFileInput ref={inputRef} onChange={onSelectFile} />
      <Button onClick={() => inputRef.current.click()}>파일 업로드</Button>
    </div>
  );
}
