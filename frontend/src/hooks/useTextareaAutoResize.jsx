// frontend/src/hooks/useTextareaAutoResize.jsx

import { useEffect } from "react";

const useTextareaAutoResize = (textareaRef, input) => {
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [textareaRef, input]);
};

export default useTextareaAutoResize;
