import React from "react";
import TextDivisionComponent from "../components/Points";
import SliderComponent from "../components/Slider";
import useDisableBackNavigation from "../components/BackNavigationPreventer";

const Home = () => {
  useDisableBackNavigation();
  return (
    <div className="root-container">
      <SliderComponent />
      <TextDivisionComponent />
    </div>
  );
};

export default Home;
