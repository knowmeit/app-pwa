import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomFileInput from "../components/CustomeInput";
import { useNavigate } from "react-router-dom";

const CapturePhoto = () => {
  const [photoTaken, setPhotoTaken] = useState(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [document_type, set_document_type] = useState("national_card");
  const [send_photo_type, set_send_photo_type] = useState("camera");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = window.localStorage.getItem("token");
  const [loading, set_loading] = useState(false);
  const navigate = useNavigate();

  const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    stopCamera();
    try {
      const videoConstraints = isIOS()
        ? { facingMode: "environment" }
        : {
            facingMode: { ideal: "environment" },
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing the camera: ", err);
      alert("Please allow camera access in your browser settings.");
    }
  };

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
    fetchUserStep();
    const storedSendPhotoType =
      window.localStorage.getItem("send_photo_type") || "camera";
    set_send_photo_type(storedSendPhotoType);

    if (storedSendPhotoType === "camera") {
      startCamera();
    }

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      stopCamera();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFileChange = (photo) => {
    setPhotoTaken(photo);
    setIsPhotoTaken(true);
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const greenBoxWidth = video.videoWidth * 0.95;
    const greenBoxHeight =
      document_type === "national_card"
        ? video.videoHeight * 0.5
        : video.videoHeight * 0.9;
    const greenBoxX = (video.videoWidth - greenBoxWidth) / 2;
    const greenBoxY = (video.videoHeight - greenBoxHeight) / 2;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = greenBoxWidth;
    croppedCanvas.height = greenBoxHeight;
    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(
      canvas,
      greenBoxX,
      greenBoxY,
      greenBoxWidth,
      greenBoxHeight,
      0,
      0,
      greenBoxWidth,
      greenBoxHeight
    );

    const photo = croppedCanvas.toDataURL("image/png");
    setPhotoTaken(photo);
    setIsPhotoTaken(true);
    stopCamera();
  };

  const sendPhotoToAPI = async () => {
    fetchUserStep();
    if (photoTaken) {
      set_loading(true);
      try {
        const byteString = atob(photoTaken.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "image/png" });
        const formData = new FormData();
        formData.append("image_file", blob, "photo.png");
        formData.append(
          "document_type",
          document_type === "national_card" ? "id-card" : "passport"
        );

        await axios
          .post(
            `${window.BASE_URL_KNOWME}/v2/sessions/upload/?token=${token}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
          .then((res) => {
            set_loading(false);
            window.location.href = "/help";
          })
          .catch((e) => {
            set_loading(false);
            console.error("Error uploading photo:", e.response?.data);
          });

        console.log("document_type : ", document_type);
      } catch (error) {
        set_loading(false);
        console.error("Error uploading photo:", error);
      }
    } else {
      console.error("No photo to upload");
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(null);
    setIsPhotoTaken(false);
    navigate("/photo-type");
  };

  const handleDocumentTypeChange = (type) => {
    if (document_type !== type) {
      set_document_type(type);
    }
  };

  const videoWidth = screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85;
  const videoHeight =
    screenWidth > 600 ? screenHeight * 0.5 : screenHeight * 0.7;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <p style={{ fontSize: "17px", textAlign: "center" }}>
        لطفا نوع مدرک ارسالی خود را مشخص کنید و سپس انتخاب کنید میخواهید با
        استفاده از دوربین عکس گرفته یا عکس را از گالری خود ارسال کنید.
      </p>

      {!isPhotoTaken && (
        <div style={{ marginBottom: "20px" }}>
          <label>
            <input
              type="checkbox"
              checked={document_type === "national_card"}
              onChange={() => handleDocumentTypeChange("national_card")}
            />
            کارت ملی
          </label>
          <label style={{ marginRight: "20px" }}>
            <input
              type="checkbox"
              checked={document_type === "passport"}
              onChange={() => handleDocumentTypeChange("passport")}
            />
            گذرنامه
          </label>
        </div>
      )}

      {!isPhotoTaken && send_photo_type === "camera" && (
        <div
          style={{
            width: `${videoWidth}px`,
            height: `${videoHeight}px`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          ></video>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "95%",
              height: document_type === "national_card" ? "50%" : "90%",
              border: "2px solid green",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      )}

      {!isPhotoTaken && send_photo_type === "gallery" && (
        <CustomFileInput onFileChange={handleFileChange} />
      )}

      {isPhotoTaken && (
        <div style={{ width: `${videoWidth}px`, height: `${videoHeight}px` }}>
          <img
            src={photoTaken}
            alt="Captured"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <button
        onClick={isPhotoTaken ? retakePhoto : takePhoto}
        style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}
      >
        {isPhotoTaken ? "بارگذاری مجدد عکس" : "گرفتن عکس"}
      </button>

      {isPhotoTaken && (
        <button
          onClick={sendPhotoToAPI}
          style={{ padding: "10px 20px", fontSize: "16px", margin: "0" }}
          disabled={loading}
        >
          {loading ? "درحال ارسال عکس" : " ارسال عکس"}
        </button>
      )}
    </div>
  );
};

export default CapturePhoto;
