import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TextDivisionComponent = () => {
  const actions = window.sessionStorage.getItem("actions");
  const navigate = useNavigate();
  const [myactions, set_myactions] = useState([]);

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

  const getActions = async () => {
    const all_actions = actions;
    const translated = all_actions.map(
      (action) => actionTranslations[action] || action
    );
    set_myactions(translated);
  };

  useEffect(() => {
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
          ابتدا به <b>{myactions[0]}</b> نگاه کنید
        </li>
        <li>
          سپس با دقت به <b>{myactions[1]}</b> نگاه کنید
        </li>
        <li>
          در نهایت دوباره به <b>{myactions[2]}</b> نگاه کنید
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
