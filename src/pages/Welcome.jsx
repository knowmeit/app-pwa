import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdMargin } from "react-icons/md";

const Welcome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    // Check if the 'token' parameter exists (even if empty)
    if (token !== null) {
      window.localStorage.setItem("token", token);
      console.log("Token saved to localStorage:", token);

      setLoading(true);

      axios
        .get(
          `${window.BASE_URL_KNOWME}/v2/sessions/instruction/?token=${token}`
        )
        .then((res) => {
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
            if (
              res.data.data.service_codename === "liveness-verification-001"
            ) {
              window.location.href = "/help";
            } else {
              window.location.href = "/upload-photo";
            }
          }, 3000);
        })
        .catch((error) => {
          console.error("Error calling API:", error);
          setLoading(false);
        });
    }
  }, [navigate]);

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
