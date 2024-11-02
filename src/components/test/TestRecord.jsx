import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./webcamStyles.css";

const TestRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [countdown, setCountdown] = useState(6);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [displayText, setDisplayText] = useState(""); // State for displaying text

  const token =
    "NDcyYmE5ODUtMTE4NC00Yzk1LWI5MmMtODE4ZWIwOGRmZTU3OjFzb0twTDo0eTZGSWR3MG5jNHhreXU1WGVDN3B1dkJjLWdlQ21sWm1LZ0JxNWd4dEJn";

  const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const videoConstraints = {
    width: 1280,
    height: 720,
    frameRate: 30,
  };

  useEffect(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    }
  }, []);

  const handleStartCaptureClick = () => {
    const mimeType = isIOS() ? "video/mp4" : "video/webm";

    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      setCountdown(6);
      setDisplayText("به روبرو نگاه کنید"); // Display the first text
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType,
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Change text after 2 seconds
      setTimeout(() => {
        setDisplayText("سرخود را به سمت چپ بچرخانید");
      }, 2000);

      // Change text again after another 2 seconds
      setTimeout(() => {
        setDisplayText("سرخود را به سمت دوربین برگردانید");
      }, 4000);

      // Stop recording after 6 seconds
      setTimeout(() => {
        clearInterval(countdownInterval);
        handleStopCaptureClick();
      }, 6000);
    } else {
      console.error("Webcam not available");
    }
  };

  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStopCaptureClick = () => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    setRecordingComplete(true);
    setDisplayText(""); // Clear the text after recording ends
  };

  const handleRecordAgain = () => {
    setRecordedChunks([]);
    setVideoUrl(null);
    setRecordingComplete(false);
    handleStartCaptureClick();
  };

  const handleUpload = async () => {
    if (recordedChunks.length) {
      setUploading(true);
      const mimeType = isIOS() ? "video/mp4" : "video/webm";

      const blob = new Blob(recordedChunks, {
        type: mimeType,
      });

      const formData = new FormData();
      formData.append(
        "video_file",
        blob,
        "video." + (isIOS() ? "mp4" : "webm")
      );

      try {
        const response = await axios.post(
          `https://api.know-me.ir/v2/sessions/upload/?token=${token}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUploading(false);
        alert("Upload successful!");
      } catch (error) {
        console.error("Error uploading video:", error);
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    if (recordedChunks.length) {
      const mimeType = isIOS() ? "video/mp4" : "video/webm";
      const videoBlob = new Blob(recordedChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);

      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [recordedChunks]);

  return (
    <div className="video-container">
      <div>
        {capturing ? <p style={{ color: "green" }}>{displayText}</p> : null}
      </div>
      {!recordingComplete && (
        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={videoConstraints}
          className="responsive-webcam"
        />
      )}

      {videoUrl ? (
        <div className="preview-container">
          <video
            src={videoUrl}
            controls
            className="recorded-video"
            onClick={(e) => e.target.play()}
            autoPlay
          />
          <div className="buttons-container">
            <button className="record-btn" onClick={handleRecordAgain}>
              ضبط مجدد
            </button>
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "در حال ارسال ویدیو..." : "ارسال ویدیو"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {capturing ? (
            <div>
              <button className="record-btn-timing">
                زمان باقیمانده : {countdown} ثانیه
              </button>
            </div>
          ) : (
            <button className="record-btn" onClick={handleStartCaptureClick}>
              ضبط ویدیو
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestRecorder;