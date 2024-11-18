import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useDisableBackNavigation from "../components/BackNavigationPreventer";

const Welcome = () => {
  useDisableBackNavigation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const fetchUserStep = async () => {
  //   setLoading(true);
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const token = urlParams.get("token");
  //   try {
  //     const response = await axios.get(
  //       `${window.BASE_URL_KNOWME}/v2/sessions/state/?token=${token}`
  //     );

  //     if (response.data.code === "session-expired") {
  //       window.showToast("error", "نشست شما منقضی شده است!");
  //       const redirect_to = window.localStorage.getItem("redirect_to");
  //       setTimeout(() => {
  //         window.location.href = redirect_to;
  //       }, 4000);
  //     } else if (response.data.code === "success") {
  //       const steps = response.data.data.steps;

  //       if (steps.includes("upload-face-video")) {
  //         navigate("help");
  //       } else if (steps.includes("upload-document")) {
  //         navigate("/upload-photo");
  //       }
  //     } else if (response.data.code === "no-more-steps") {
  //       window.showToast("error", "شما قبلا ویدیو خود را ارسال کرده اید!");
  //       const redirect_to = window.localStorage.getItem("redirect_to");

  //       setTimeout(() => {
  //         window.location.href = redirect_to;
  //       }, 4000);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user step:", error);
  //     setLoading(false);
  //   }
  // };

  const fetchUserStep = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

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
      } else if (response.data.code === "success") {
        const steps = response.data.data.steps;

        // Check if both steps are present
        if (
          steps.includes("upload-document") &&
          steps.includes("upload-face-video")
        ) {
          navigate("/upload-photo");
        } else if (steps.includes("upload-face-video")) {
          navigate("/record-video");
        } else if (steps.includes("upload-document")) {
          navigate("/upload-photo");
        }
      } else if (response.data.code === "no-more-steps") {
        window.showToast("error", "شما قبلا ویدیو خود را ارسال کرده اید!");
        const redirect_to = window.localStorage.getItem("redirect_to");
        setTimeout(() => {
          window.location.href = redirect_to;
        }, 4000);
      }
    } catch (error) {
      console.error("Error fetching user step:", error);
      setLoading(false);
    }
  };

  const getInstructions = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token !== null) {
      window.localStorage.setItem("token", token);
      console.log("Token saved to localStorage:", token);

      setLoading(true);

      try {
        const res = await axios.get(
          `${window.BASE_URL_KNOWME}/v2/sessions/instruction/?token=${token}`
        );

        const all_actions = res.data.data.instruction;
        window.sessionStorage.setItem("actions", all_actions);
        window.localStorage.setItem("redirect_to", res.data.data.redirect_to);
        if (res.data.data.service_codename === "liveness-verification-001") {
          window.localStorage.setItem("typeOfAuth", "sabteAhval");
        } else {
          window.localStorage.setItem("typeOfAuth", "karteMelli");
        }
        window.localStorage.setItem(
          "service_codename",
          res.data.data.service_codename
        );
        console.log(res);
        setTimeout(() => {
          fetchUserStep();
        }, 3000);
      } catch (error) {
        console.error("Error calling API:", error);
        // Call fetchUserStep even if there is an error
        fetchUserStep();
        setLoading(false);
      } finally {
       
      }
    }
  };

  useEffect(() => {
    getInstructions();
  }, []);

  return (
    <div style={styles.container}>
      <h2>خوش آمدید</h2>
      {loading && <div className="spinner"></div>}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "200px",
  },
};

export default Welcome;
