import React from "react";
import WebcamRecorder from "../components/WebcamRecorder";
import useDisableBackNavigation from "../components/BackNavigationPreventer";

const RecordVideo = () => {
  useDisableBackNavigation();

  return (
    <div>
      <WebcamRecorder />
    </div>
  );
};

export default RecordVideo;
