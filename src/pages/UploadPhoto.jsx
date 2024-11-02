import { useState, useEffect, useRef } from "react";
import axios from "axios";

const CapturePhoto = () => {
  const [photoTaken, setPhotoTaken] = useState(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = window.localStorage.getItem("token");
  const [loading, set_loading] = useState(false);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing the camera: ", err);
      alert("Please allow camera access in your browser settings.");
    }
  };

  useEffect(() => {
    startCamera();

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const photo = canvas.toDataURL("image/png");
    setPhotoTaken(photo);
    setIsPhotoTaken(true);
  };

  const sendPhotoToAPI = async () => {
    if (photoTaken) {
      set_loading(true);
      try {
        // Convert base64 to Blob
        const byteString = atob(photoTaken.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "image/png" });

        // Create FormData and append Blob as a file
        const formData = new FormData();
        formData.append("image_file", blob, "photo.png");

        // Send the request with Content-Type as multipart/form-data
        await axios
          .post(
            `${window.BASE_URL_KNOWME}/v2/sessions/upload/?token=${token}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
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
    startCamera();
  };

  // Determine width and height based on screen width
  const videoWidth = screenWidth > 600 ? screenWidth * 0.4 : screenWidth * 0.85;
  const videoHeight =
    screenWidth > 600 ? screenHeight * 0.5 : screenHeight * 0.7;

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
      {isPhotoTaken ? null : (
        <p style={{ fontSize: "17px", textAlign: "center" }}>
          لطفا از کارت ملی خود عکس گرفته و سپس دکمه ارسال عکس را بزنید.
        </p>
      )}
      {!isPhotoTaken ? (
        <div
          style={{
            width: `${videoWidth}px`, // 50% or 85% of screen width
            height: `${videoHeight}px`, // 30% or 70% of screen height
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

          {/* Green box overlay slightly smaller than video box */}
          <div
            style={{
              position: "absolute",
              top: "5%", // Margin from the top
              left: "5%", // Margin from the left
              width: "90%", // 90% of video box width
              height: "90%", // 90% of video box height
              border: "2px solid green",
              boxSizing: "border-box",
            }}
          ></div>
        </div>
      ) : (
        <div
          style={{
            width: `${videoWidth}px`, // Match video box width
            height: `${videoHeight}px`, // Match video box height
          }}
        >
          <img
            src={photoTaken}
            alt="Captured"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
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
        {isPhotoTaken ? "گرفتن مجدد عکس" : "گرفتن عکس"}
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
         {loading ? 'درحال ارسال عکس':' ارسال عکس'}
        </button>
      )}
    </div>
  );
};

export default CapturePhoto;
