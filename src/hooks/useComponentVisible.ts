import { useEffect, useRef, useState } from "react";

interface ComponentVisibleHook {
  ref: React.RefObject<any>;
  isComponentVisible: boolean;
  setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const useComponentVisible = (
  initialIsVisible: boolean
): ComponentVisibleHook => {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef<any>();

  const handleClickOutsize = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsize, true);
    return () => {
      document.removeEventListener("click", handleClickOutsize, true);
    };
  });

  return {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  };
};

export default useComponentVisible;
