import React, { useState, useRef } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";

export default function FillForm() {
  const [national_code, set_national_code] = useState("");
  const [selected_date, set_selected_date] = useState(null);
  const [birthdate, set_birthdate] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [loading, set_loading] = useState(false);
  const typeOfAuth = window.localStorage.getItem("typeOfAuth");
  const [serviceId, set_serviceId] = useState("");
  const navigate = useNavigate();
  const [, forceUpdate] = useState();
  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "پر کردن این فیلد الزامیست",
        numeric: "کدملی باید عدد و شامل ۱۰ کاراکتر باشد",
        min: "کدملی باید ۱۰ رقم باشد",
        max: "کدملی باید ۱۰ رقم باشد",
      },
      element: (message) => (
        <div
          style={{
            color: "red",
            fontSize: "16px",
            fontFamily: "BYekan",
            marginTop: "10px",
          }}
        >
          {message}
        </div>
      ),
    })
  );

  const handleDateChange = (date) => {
    if (date) {
      const gregorianDate = date.toDate();
      const miladiDate = gregorianDate.toISOString().split("T")[0];
      set_birthdate(miladiDate);

      const timestamp = gregorianDate.getTime();
      set_selected_date(timestamp);
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (typeOfAuth === "sabteAhval") {
  //     set_serviceId("3a3025c2-fe3a-454e-abe0-6cc2b0a64515");
  //   } else {
  //     set_serviceId("c4fd716d-e7f1-4fd5-8ab3-31233e99df27");
  //   }

  //   const data = { national_code, birthdate };
  //   try {
  //     if (validator.current.allValid()) {
  //       set_loading(true);
  //       await axios
  //         .post(
  //           `${window.BASE_URL_KNOWME_CLIENT}/sandbox/create_session`,
  //           data,
  //           {
  //             headers: {
  //               "SERVICE-ID": serviceId,
  //             },
  //           }
  //         )
  //         .then((res) => {
  //           console.log(res.data.token);
  //           window.localStorage.setItem("token", res.data.token);
  //           set_loading(false);
  //           if (typeOfAuth === "sabteAhval") {
  //             window.location.href = "/help";
  //           } else {
  //             window.location.href = "/upload-photo";
  //           }
  //         })
  //         .catch((e) => {
  //           console.log(e.response.data);
  //           set_loading(false);
  //           window.showToast("error", e.response.data.detail);
  //         });
  //       console.log("data : ", data);
  //     } else {
  //       validator.current.showMessages();
  //       forceUpdate(1);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     set_loading(false);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedServiceId =
      typeOfAuth === "sabteAhval"
        ? "3a3025c2-fe3a-454e-abe0-6cc2b0a64515"
        : "c4fd716d-e7f1-4fd5-8ab3-31233e99df27";

    const data = { national_code, birthdate };
    try {
      if (validator.current.allValid()) {
        set_loading(true);
        await axios
          .post(
            `${window.BASE_URL_KNOWME_CLIENT}/sandbox/create_session`,
            data,
            {
              headers: {
                "SERVICE-ID": selectedServiceId, // use selectedServiceId directly
              },
            }
          )
          .then((res) => {
            console.log(res.data.token);
            window.localStorage.setItem("token", res.data.token);
            set_loading(false);
            if (typeOfAuth === "sabteAhval") {
              window.location.href = "/help";
            } else {
              window.location.href = "/upload-photo";
            }
          })
          .catch((e) => {
            console.log(e.response.data);
            set_loading(false);
            window.showToast("error", e.response.data.detail);
          });
        console.log("data : ", data);
      } else {
        validator.current.showMessages();
        forceUpdate(1);
      }
    } catch (e) {
      console.log(e);
      set_loading(false);
    }
  };

  return (
    <div className="form-container">
      <p style={{ textAlign: "center", fontSize: "19px" }}>
        لطفا فرم زیر را تکمیل نمایید:
      </p>
      <div>
        <div style={{ margin: "10px auto", display: "table" }}>
          <p style={{ marginLeft: "23px" }}>کد ملی : </p>
          <input
            className="my-input"
            type="text"
            name="national_code"
            value={national_code}
            onChange={(e) => set_national_code(e.target.value)}
            maxLength={10}
          />
          {validator.current.message(
            "national_code",
            national_code,
            "required|numeric|min:10|max:10"
          )}
        </div>
        <div style={{ margin: "10px auto", display: "table" }}>
          <p style={{ marginLeft: "5px" }}>تاریخ تولد : </p>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            name="selected_date"
            value={selected_date}
            onChange={handleDateChange}
          />
          {validator.current.message(
            "selected_date",
            selected_date,
            "required"
          )}
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "درحال ثبت اطلاعات" : "ثبت اطلاعات"}
        </button>
      </div>
    </div>
  );
}
