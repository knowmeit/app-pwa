import React from "react";
import "./myalert.css";

// const WebcamPermissionPrompt = ({ onAllow }) => {
//   return (
//     <div className="webcam-permission-prompt">
//       <div className="prompt-content">
//         <p>
//           برای استفاده از دوربین، لطفاً اجازه دسترسی را در مرورگر خود فعال کنید.
//         </p>
//         <button onClick={onAllow} className="allow-button">
//           اجازه دسترسی
//         </button>
//       </div>
//     </div>
//   );
// };

const CustomAlert = ({ message, onConfirm }) => {
  return (
    <div className="custom-alert">
      <div className="alert-content">
        <p>{message}</p>
        <button onClick={onConfirm} className="confirm-button">
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
