// https://chatgpt.com/c/67346882-b650-8010-83e4-373c04719217
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useDisableBackNavigation from "../components/BackNavigationPreventer";
import CustomFileInput from "../components/CustomeInput";

const CapturePhoto = () => {
  useDisableBackNavigation();
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

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  // Function to stop the camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Function to start the camera
  const startCamera = async () => {
    stopCamera(); // Stop any existing stream before starting a new one

    try {
      const videoConstraints = isIOS()
        ? { facingMode: "environment" } // Simplified constraints for iOS
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

  // Effect to handle camera start and stop on changes
  useEffect(() => {
    if (send_photo_type === "camera") {
      startCamera();
    }

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      stopCamera(); // Stop the camera when the component unmounts
      window.removeEventListener("resize", handleResize);
    };
  }, [send_photo_type, document_type]);

  const handleFileChange = (photo) => {
    setPhotoTaken(photo); // Set the base64 image for preview
    setIsPhotoTaken(true);
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Set the canvas size to match the video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Calculate the cropping area based on the green box
    const greenBoxWidth = video.videoWidth * 0.95;
    const greenBoxHeight =
      document_type === "national_card"
        ? video.videoHeight * 0.5
        : video.videoHeight * 0.9;
    const greenBoxX = (video.videoWidth - greenBoxWidth) / 2;
    const greenBoxY = (video.videoHeight - greenBoxHeight) / 2;

    // Extract the cropped image data
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = greenBoxWidth;
    croppedCanvas.height = greenBoxHeight;
    const croppedCtx = croppedCanvas.getContext("2d");

    // Draw the cropped area from the main canvas onto the new cropped canvas
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

    // Convert the cropped canvas to a data URL
    const photo = croppedCanvas.toDataURL("image/png");
    setPhotoTaken(photo);
    setIsPhotoTaken(true);
    stopCamera(); // Stop the camera after taking a photo
  };

  const sendPhotoToAPI = async () => {
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
            if (res.status === 401) {
              window.showToast("error", "نشست شما منقضی شده است!");
            }
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
    if (send_photo_type === "camera") {
      startCamera(); // Restart the camera when retaking a photo
    }
  };

  const videoWidth = screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85;
  const videoHeight =
    screenWidth > 600 ? screenHeight * 0.5 : screenHeight * 0.7;

  const handleDocumentTypeChange = (value) => {
    set_document_type(value === document_type ? "" : value);
  };

  const handleSendPhotoTypeChange = (value) => {
    set_send_photo_type(value === send_photo_type ? "" : value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        boxSizing: "border-box",
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

      {!isPhotoTaken && (
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={send_photo_type === "camera"}
              onChange={() => handleSendPhotoTypeChange("camera")}
            />
            استفاده از دوربین
          </label>
          <label style={{ marginRight: "5px" }}>
            <input
              type="checkbox"
              checked={send_photo_type === "gallery"}
              onChange={() => handleSendPhotoTypeChange("gallery")}
            />
            انتخاب عکس از گالری
          </label>
        </div>
      )}

      {send_photo_type === "camera" && !isPhotoTaken && (
        <div
          style={{
            width: `${videoWidth}px`,
            height: `${videoHeight}px`,
            position: "relative",
            overflow: "hidden",
            flexGrow: 1,
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
              boxSizing: "border-box",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      )}

      {send_photo_type === "gallery" && !isPhotoTaken && (
        <CustomFileInput onFileChange={handleFileChange} />
      )}

      {isPhotoTaken && (
        <div
          style={{
            width: `${videoWidth}px`,
            height: `${videoHeight}px`,
          }}
        >
          <img
            src={photoTaken}
            alt="Captured"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <button
        onClick={isPhotoTaken ? retakePhoto : takePhoto}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        {isPhotoTaken ? "بارگذاری مجدد عکس" : "بارگذاری عکس"}
      </button>

      {isPhotoTaken && (
        <button
          onClick={sendPhotoToAPI}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            margin: "0",
          }}
          disabled={loading}
        >
          {loading ? "درحال ارسال عکس" : " ارسال عکس"}
        </button>
      )}
    </div>
  );
};

export default CapturePhoto;
