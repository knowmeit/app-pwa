import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useUserStep = () => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const redirect_to = window.localStorage.getItem("redirect_to");

  useEffect(() => {
    const fetchUserStep = async () => {
      try {
        const response = await axios.get(
          `${window.BASE_URL_KNOWME}/v2/sessions/state/?token=${token}`
        );

        if (response.data.code === "session-expired") {
          navigate(redirect_to); // Redirect to welcome page
        } else if (response.data.code === "success") {
          const steps = response.data.data.steps;

          if (steps.includes("upload-face-video")) {
            navigate("help"); // Redirect to upload video page
          } else if (steps.includes("upload-document")) {
            navigate("/upload-photo"); // Redirect to upload document page
          }
        } else if (response.data.code === "no-more-steps") {
          navigate(redirect_to); // Redirect to welcome page
        }
      } catch (error) {
        console.error("Error fetching user step:", error);
      }
    };

    fetchUserStep();
  }, [navigate]);
};

export default useUserStep;
