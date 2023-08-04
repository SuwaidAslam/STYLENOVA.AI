import "../style/boostrap.css";
import "../style/custom.css";

import { ContactForm } from "../components/ContactForm";

export const Subscribe = ({languageData}) => {
  return (
    <div className="subscribe_container mb-2 py-3 py-lg-5 ">
      <div className="container d-flex flex-column align-items-center">
        <h2 className="text-white pt-4 mb-4">{languageData.title}</h2>
        <p className="text-white mb-5">
          {languageData.description}
        </p>
        <ContactForm languageData={languageData}/>
      </div>
    </div>
  );
};
