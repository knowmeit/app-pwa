import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseAuthentication = () => {
  const navigate = useNavigate();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const authWithSabteAhval = () => {
    window.localStorage.setItem("typeOfAuth", "sabteAhval");
    navigate("/form");
  };

  const authWithKarteMelli = () => {
    window.localStorage.setItem("typeOfAuth", "karteMelli");
    navigate("/form");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: `${screenHeight - 100}px`, // Set height to the screen height
      }}
    >
      <button
        onClick={authWithSabteAhval}
        style={{ margin: "0", padding: "15px 20px" }}
      >
        احراز ثبت احوال
      </button>
      <button onClick={authWithKarteMelli} style={{ padding: "15px 20px" }}>
        احراز با کارت ملی
      </button>
    </div>
  );
};

export default ChooseAuthentication;
