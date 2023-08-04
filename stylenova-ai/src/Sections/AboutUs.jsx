import "../style/boostrap.css";

import { Card } from "../components/Card";

export const AboutUs = ({languageData}) => {
  return (
    <div className="About_Us_container text-white py-3 py-lg-5">
      <div className="container">
        <h2 className="mb-5">{languageData.title}</h2>
        <Card languageData={languageData.features}/>
      </div>
    </div>
  );
};
