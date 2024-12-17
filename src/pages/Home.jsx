import React from "react";
import TextDivisionComponent from "../components/Points";
import useDisableBackNavigation from "../components/BackNavigationPreventer";

const Home = () => {
  useDisableBackNavigation();
  return (
    <div className="root-container">
      <TextDivisionComponent />
    </div>
  );
};

export default Home;
