import React, { useState, useEffect } from "react";

import Button from "./Button";

export default function ConfirmButton({ children, onClick }) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      // TODO: set clicked to false after 3 secs
      const timeoutId = setTimeout(() => setClicked(false), 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [clicked]);

  return (
    <Button
      primary={clicked}
      onClick={(event) => {
        event.stopPropagation();
        if (clicked) {
          setClicked(false);
          onClick();
        } else {
          setClicked(true);
        }
      }}
    >
      {clicked ? "확인" : children}
    </Button>
  );
}
