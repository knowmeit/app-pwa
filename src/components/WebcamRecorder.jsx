import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./webcamStyles.css";

const WebcamRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [countdown, setCountdown] = useState(6);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const token = window.localStorage.getItem("token");
  const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 30 },
    facingMode: "user",
  };

  const storedActions = sessionStorage.getItem("actions");
  let actions = [];

  try {
    actions = JSON.parse(storedActions) || [];
  } catch (e) {
    if (storedActions) {
      actions = storedActions.split(",");
    }
  }

  const actionImages = {
    Forward: "/images/forward.png",
    Right: "/images/right.png",
    Left: "/images/left.png",
    Down: "/images/down.png",
    Up: "/images/up.png",
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
    const updateHeight = () => setScreenHeight(window.innerHeight);
    const updateWidth = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", updateHeight);
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const handleStartCaptureClick = () => {
    const mimeType = isIOS() ? "video/mp4" : "video/webm";

    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      setCountdown(6);
      setCurrentActionIndex(0);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType,
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();

      const countdownInterval = setInterval(
        () => setCountdown((prev) => prev - 1),
        1000
      );
      const actionInterval = setInterval(
        () => setCurrentActionIndex((prev) => prev + 1),
        2000
      );

      setTimeout(() => {
        clearInterval(countdownInterval);
        clearInterval(actionInterval);
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
    setCurrentActionIndex(-1);
  };

  const handleRecordAgain = () => {
    setRecordedChunks([]);
    setVideoUrl(null);
    setRecordingComplete(false);
    handleStartCaptureClick();
  };

  const handleUpload = async () => {
    fetchUserStep();
    if (recordedChunks.length) {
      setUploading(true);
      const mimeType = isIOS() ? "video/mp4" : "video/webm";

      const blob = new Blob(recordedChunks, { type: mimeType });
      const formData = new FormData();
      formData.append(
        "video_file",
        blob,
        "video." + (isIOS() ? "mp4" : "webm")
      );

      try {
        await axios
          .post(
            `${window.BASE_URL_KNOWME}/v2/sessions/upload/?token=${token}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (progressEvent) => {
                const percentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentage);
              },
            }
          )
          .then((res) => {
            setUploading(false);
            window.location.href = "/redirect";
          })
          .catch((e) => {
            setUploading(false);
            window.showToast("error", e.response.data.detail);
          });
      } catch (error) {
        // if (e.response.data.code === "session-expired") {
        //   window.showToast("error", "نشست شما منقضی شده است!");
        //   const redirect_to = window.localStorage.getItem("redirect_to");
        //   setTimeout(() => {
        //     window.location.href = redirect_to;
        //   }, 4000);
        // }
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserStep();
    if (recordedChunks.length) {
      const mimeType = isIOS() ? "video/mp4" : "video/webm";
      const videoBlob = new Blob(recordedChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);

      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [recordedChunks]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const updateTimer = () => {
    const video = videoRef.current;
    if (!isNaN(video.currentTime) && !isNaN(video.duration)) {
      const formattedCurrentTime = new Date(video.currentTime * 1000)
        .toISOString()
        .substr(14, 5);
      const formattedDuration = new Date(video.duration * 1000)
        .toISOString()
        .substr(14, 5);
      setCurrentTime(formattedCurrentTime);
      setDuration(formattedDuration);
    } else {
      setCurrentTime("00:00");
      setDuration("00:00");
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    const progressBar = document.getElementById("progress-bar");
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progress}%`;
    updateTimer();
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const newTime =
      (e.nativeEvent.offsetX / e.target.offsetWidth) * video.duration;
    video.currentTime = newTime;
  };

  const handleVideoEnded = () => setIsPlaying(false);

  return (
    <div className="video-container">
      {screenWidth > 768
        ? !recordingComplete && (
            <div>
              <div className="action-container">
                <p>دکمه‌ی ضبط را بزنید و سرخود را به جهت‌های زیر بچرخانید</p>
                <div className="action-images">
                  {actions.map((action, index) => (
                    <img
                      key={index}
                      src={actionImages[action]}
                      alt={action}
                      className="move-action"
                      style={{
                        backgroundColor:
                          index === currentActionIndex ? "green" : "gray",
                      }}
                    />
                  ))}
                </div>
              </div>
              <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                className="responsive-webcam"
                style={{ height: `${screenHeight - 250}px` }}
                mirrored={true}
              />
            </div>
          )
        : !recordingComplete && (
            <div>
              <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                className="responsive-webcam"
                style={{ height: `${screenHeight - 100}px` }}
                mirrored={true}
              />
              <div className="action-container">
                <p>دکمه‌ی ضبط را بزنید و سرخود را به جهت‌های زیر بچرخانید</p>
                <div className="action-images">
                  {actions.map((action, index) => (
                    <img
                      key={index}
                      src={actionImages[action]}
                      alt={action}
                      className="move-action"
                      style={{
                        backgroundColor:
                          index === currentActionIndex ? "green" : "gray",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

      {videoUrl ? (
        <div className="preview-container">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              src={videoUrl}
              className="recorded-video"
              onClick={togglePlayPause}
              onTimeUpdate={updateProgress}
              onLoadedMetadata={updateTimer}
              onEnded={handleVideoEnded}
              autoPlay={false}
              style={{ height: `${screenHeight - 170}px` }}
            />
            <div className="video-controls">
              <div className="time-display">
                {currentTime} / {duration}
              </div>
              <div
                className="progress-bar-container"
                onClick={handleSeek}
                style={{ cursor: "pointer" }}
              >
                <div className="progress-bar">
                  <div id="progress-bar" className="progress-bar-filled"></div>
                </div>
              </div>
              <button onClick={togglePlayPause} className="play-button">
                {isPlaying ? "⏸" : "▶️"}
              </button>
            </div>
          </div>
          {uploading && (
            <div className="progress-container-video">
              <div
                className="progress-bar-video"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
          <div className="buttons-container">
            <button className="record-btn" onClick={handleRecordAgain}>
              ضبط مجدد
            </button>
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? `در حال ارسال ویدیو...` : "ارسال ویدیو"}
            </button>
          </div>
        </div>
      ) : capturing ? (
        <button className="record-btn-timing">
          زمان باقیمانده : {countdown} ثانیه
        </button>
      ) : (
        <button className="record-btn" onClick={handleStartCaptureClick}>
          ضبط ویدیو
        </button>
      )}
    </div>
  );
};

export default WebcamRecorder;
