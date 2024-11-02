import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import RecordVideo from "../pages/RecordVideo";
import Result from "../pages/Result";
import Welcome from "../pages/Welcome";
import CapturePhoto from "../pages/UploadPhoto";
import RedirectToApp from "../pages/Redirect";

const routeConfig = [
  { path: "/", component: Welcome, isPrivate: false },
  { path: "/record-video", component: RecordVideo, isPrivate: true },
  { path: "/help", component: Home, isPrivate: false },
  { path: "/result", component: Result, isPrivate: true },
  { path: "/upload-photo", component: CapturePhoto, isPrivate: true },
  { path: "/redirect", component: RedirectToApp, isPrivate: false },
];

const PrivateRoute = ({ children }) => {
  const token = window.localStorage.getItem("token");
  return token ? children : <ChooseAuthentication />;
};

const BasicRoutes = () => {
  return (
    <Routes>
      {routeConfig.map(({ path, component: Component, isPrivate }, index) =>
        isPrivate ? (
          <Route
            key={index}
            path={path}
            element={
              <PrivateRoute>
                <Component />
              </PrivateRoute>
            }
          />
        ) : (
          <Route key={index} path={path} element={<Component />} />
        )
      )}
    </Routes>
  );
};

export default BasicRoutes;
