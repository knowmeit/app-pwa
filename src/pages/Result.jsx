import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsCheckCircleFill } from "react-icons/bs";
import { BsExclamationTriangleFill } from "react-icons/bs";

const Result = () => {
  const [result, set_result] = useState(false);
  const token = window.localStorage.getItem("token");
  const [verification_flag, set_verification_flag] = useState(null);
  const [liveness_flag, set_liveness_flag] = useState(null);
  const [textMessage, set_textMessage] = useState("در حال بررسی...");
  const [loading, setLoading] = useState(true);
  const typeOfAuth = window.localStorage.getItem("typeOfAuth");
  const [data, set_data] = useState([]);
  const redirect = window.localStorage.getItem("redirect_to");

  const handleNavigate = () => {
    localStorage.clear();
    window.location.href = redirect;
  };

  const getResult = async () => {
    const data = { token };
    const selectedServiceId =
      typeOfAuth === "sabteAhval"
        ? "3a3025c2-fe3a-454e-abe0-6cc2b0a64515"
        : "c4fd716d-e7f1-4fd5-8ab3-31233e99df27";

    setTimeout(async () => {
      await axios
        .post(`${window.BASE_URL_KNOWME}/sandbox/take_result`, data, {
          headers: {
            "SERVICE-ID": selectedServiceId,
          },
        })
        .then((res) => {
          console.log(res);
          set_data(res.data);
          set_liveness_flag(res.data.liveness_flag);
          set_verification_flag(res.data.verification_flag);
          setLoading(false);
          window.localStorage.removeItem("token");
        })
        .catch((e) => {
          console.log(e);
          set_textMessage("خطا در دریافت اطلاعات");
          setLoading(false);
          window.localStorage.removeItem("token");
        });
    }, 6000); // 6 seconds delay
  };

  useEffect(() => {
    getResult();
  }, [typeOfAuth]);

  useEffect(() => {
    if (!loading) {
      if (verification_flag && liveness_flag) {
        set_result(true);
        set_textMessage("احراز هویت موفق");
      } else if (!verification_flag && liveness_flag) {
        set_result(false);
        set_textMessage("عدم تطابق فرد در ویدیو با کدملی");
      } else if (verification_flag && !liveness_flag) {
        set_result(false);
        set_textMessage("خطا در تشخیص زنده بودن");
      } else if (!verification_flag && !liveness_flag) {
        set_result(false);
        set_textMessage("احراز هویت ناموفق");
      }
    }
  }, [verification_flag, liveness_flag, loading]);

  return (
    <div className="result-container">
      <h2>نتیجه احراز هویت </h2>

      <div className="result-div">
        {loading ? (
          <div>
            <BsExclamationTriangleFill className="loading-status" />
            <h3 className="loading-message">در حال بررسی...</h3>
          </div>
        ) : result === true ? (
          <div>
            <BsCheckCircleFill className="success-status" />
            <h3 className="success-message">{textMessage}</h3>
          </div>
        ) : (
          <div>
            <BsExclamationTriangleFill className="error-status" />
            <h3 className="error-message">{textMessage}</h3>
          </div>
        )}
      </div>

      <div>
        {typeOfAuth === "karteMelli" ? (
          <div>
            <p>
              <strong>نام : </strong> {data.first_name}
            </p>
            <p>
              <strong>نام خانوادگی : </strong> {data.last_name}
            </p>
            <p>
              <strong>کدملی : </strong> {data.national_code}
            </p>
            <p>
              <strong>تاریخ تولد : </strong> {data.birthdate}
            </p>
            <p>
              <strong>نام پدر : </strong> {data.father_name}
            </p>
            <p>
              <strong>پایان اعتبار : </strong> {data.expire_date}
            </p>
          </div>
        ) : null}
      </div>
      {loading ? null : (
        <button onClick={handleNavigate} disabled={loading}>
          بازگشت به خانه
        </button>
      )}
    </div>
  );
};

export default Result;
