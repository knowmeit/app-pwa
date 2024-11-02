import React, { useState, useEffect } from "react";

const RedirectToApp = () => {
  const redirect = window.localStorage.getItem("redirect_to");

  const handleNavigate = () => {
    window.location.href = redirect;
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <button onClick={handleNavigate}>بازگشت به برنامه</button>
    </div>
  );
};

export default RedirectToApp;
