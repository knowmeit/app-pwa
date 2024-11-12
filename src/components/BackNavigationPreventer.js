import { useEffect } from "react";

const useDisableBackNavigation = () => {
  useEffect(() => {
    const disableBackNavigation = () => {
      window.history.forward();
    };

    disableBackNavigation();

    window.onpopstate = disableBackNavigation;

    return () => {
      window.onpopstate = null;
    };
  }, []);
};

export default useDisableBackNavigation;
