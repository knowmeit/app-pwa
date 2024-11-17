import React, { useEffect } from "react";
import useDisableBackNavigation from "../components/BackNavigationPreventer";
import useUserStep from "../components/UserStep";

const RedirectToApp = () => {
  const redirect = window.localStorage.getItem("redirect_to");
  useDisableBackNavigation();
 
  useEffect(() => {
    // Automatically redirect after 5 seconds
    const timer = setTimeout(() => {
      handleNavigate();
    }, 5000);

    // Clear the timer if the component unmounts before 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = () => {
    try {
      if (!redirect || !isValidUrl(redirect)) {
        window.showToast("warning", "لینک بازگشت معتبر نیست.");
        return;
      }
      window.location.href = redirect;
    } catch (error) {
      window.showToast("warning", "لینک بازگشت معتبر نیست.");
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div style={{ marginTop: "100px", textAlign: "center" }}>
      <p>در حال بازگشت به اپلیکیشن...</p>
      <button onClick={handleNavigate}>بازگشت به برنامه</button>
    </div>
  );
};

export default RedirectToApp;
