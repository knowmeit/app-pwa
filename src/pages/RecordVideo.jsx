import React from "react";
import WebcamRecorder from "../components/WebcamRecorder";
import useDisableBackNavigation from "../components/BackNavigationPreventer";
import useUserStep from "../components/UserStep";

const RecordVideo = () => {
  useDisableBackNavigation();

  return (
    <div>
      <WebcamRecorder />
    </div>
  );
};

export default RecordVideo;
