import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDisableBackNavigation from "../components/BackNavigationPreventer";

const ChoosePhotoType = () => {
  const navigate = useNavigate();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const token = window.localStorage.getItem("token");

  const fetchUserStep = async () => {
    try {
      const response = await axios.get(
        `${window.BASE_URL_KNOWME}/v2/sessions/state/?token=${token}`
      );

      if (response.data.code === "session-expired") {
        window.showToast("error", "نشست شما منقضی شده است!");
        const redirect_to = window.localStorage.getItem("redirect_to");
        setTimeout(() => {
          window.location.href = redirect_to;
        }, 4000);
      } else if (response.data.code === "no-more-steps") {
        window.showToast("error", "شما قبلا ویدیو خود را ارسال کرده اید!");
        const redirect_to = window.localStorage.getItem("redirect_to");
        setTimeout(() => {
          window.location.href = redirect_to;
        }, 4000);
      }
    } catch (error) {
      if (error.response.data.code === "session-expired") {
        window.showToast("error", "نشست شما منقضی شده است!");
        const redirect_to = window.localStorage.getItem("redirect_to");
        setTimeout(() => {
          window.location.href = redirect_to;
        }, 4000);
      } else if (error.response.data.code === "no-more-steps") {
        window.showToast("error", "شما قبلا ویدیو خود را ارسال کرده اید!");
        const redirect_to = window.localStorage.getItem("redirect_to");
        setTimeout(() => {
          window.location.href = redirect_to;
        }, 4000);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const withCamera = () => {
    window.localStorage.setItem("send_photo_type", "camera");
    navigate("/upload-photo");
  };

  const withGallery = () => {
    window.localStorage.setItem("send_photo_type", "gallery");
    navigate("/upload-photo");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: `${screenHeight - 100}px`,
      }}
    >
      <button
        onClick={withCamera}
        style={{ margin: "0", padding: "15px 20px" }}
      >
        گرفتن عکس با دوربین
      </button>
      <button onClick={withGallery} style={{ padding: "15px 20px" }}>
        انتخاب عکس از گالری
      </button>
    </div>
  );
};

export default ChoosePhotoType;
