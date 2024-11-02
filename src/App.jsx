import React from "react";
import { BrowserRouter } from "react-router-dom";
import BasicRoutes from "./routes/BasicRoutes";
import "./App.css";
import BasicToast from "./components/BasicToast";

const App = () => {
  return (
    <BrowserRouter>
      <BasicRoutes />
      <BasicToast />
    </BrowserRouter>
  );
};

export default App;
