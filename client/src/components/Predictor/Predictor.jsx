import react, { useContext, useState } from "react";
import EngagementForm from "../../components/EngagementForm/EngagementForm";
import Result from "../../components/Results/Results";
import RandomData from "../../components/RandomData/RandomData";
import Visualization from "../Visualizations/Visualization";
import { AppContext } from "../../Context/AppContext";
const Predictor = () => {
  // const { result, setResult, setInput, input } = useContext(AppContext);
  return (
    <div className="p-10">
      <h1 className="text-2xl text-center mb-4">
        🎓 Student Engagement Analyzer
      </h1>
      <div className="h-0.5 w-30 bg-amber-600 mx-auto mb-4"></div>
      <EngagementForm/>
      <RandomData/>
      <Result/>
      <Visualization/>
    </div>
  );
};
export default Predictor;
