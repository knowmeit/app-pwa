import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useDisableBackNavigation from "./BackNavigationPreventer";

const TextDivisionComponent = () => {
  useDisableBackNavigation();
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [actions, set_actions] = useState([]);

  const handleSubmit = () => {
    navigate("/record-video");
  };

  // Action translation mapping
  const actionTranslations = {
    Forward: "روبرو",
    Left: "چپ",
    Right: "راست",
    Down: "پایین",
    Up: "بالا",
  };

  const fetchUserStep = async () => {
    try {
      const response = await axios.get(
        `${window.BASE_URL_KNOWME}/v2/sessions/state/?token=${token}`
      );
      console.log(response);

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

  const getActions = async () => {
    await axios
      .get(`${window.BASE_URL_KNOWME}/v2/sessions/instruction/?token=${token}`)
      .then((res) => {
        console.log(res.data.data.instruction);
        const all_actions = res.data.data.instruction;
        const translated = all_actions.map(
          (action) => actionTranslations[action] || action
        );
        set_actions(translated);
        window.sessionStorage.setItem("actions", all_actions);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchUserStep();
    getActions();
  }, []);

  return (
    <div className="points-section">
      <h3>راهنمای احراز هویت ویدیویی</h3>
      <p>
        لطفا ابتدا صورت خود را مقابل دوربین به گونه ای تنظیم کنید که در مرکز قاب
        سفید قرار گیرد.
      </p>
      <h4> سرخودرا طبق دستورالعمل به جهات خواسته شده تکان دهید : </h4>
      <ol>
        <li>
          {" "}
          ابتدا به <b>{actions[0]}</b> نگاه کنید
        </li>
        <li>
          سپس با دقت به <b>{actions[1]}</b> نگاه کنید
        </li>
        <li>
          در نهایت دوباره به <b>{actions[2]}</b> نگاه کنید
        </li>
      </ol>
      <h3>نکات مهم</h3>
      <p>
        لطفا در طول ضبط ثابت بمانید و به آرامی سر خود را در جهت های خواسته شده
        حرکت دهید.
      </p>
      <p>مطمئن شوید که نور مناسب برای ضبط ویدیو وجود دارد.</p>
      <button className="continue-btn" onClick={handleSubmit}>
        ادامه
      </button>
    </div>
  );
};

export default TextDivisionComponent;
