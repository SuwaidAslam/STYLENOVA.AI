import React from "react";

import "../style/boostrap.css";
import "../style/custom.css";

import FooterDextopNav from "../components/Footer-Dextop-Nav";
import FooterBottom from "../components/Footer-Bootom";

export const Footer = ({languageData}) => {
  return (
    <footer className="footer-main bg-white ">
      <div className="container">
        <FooterDextopNav languageData={languageData}/>
      </div>
      <FooterBottom />
    </footer>
  );
};

export default Footer;
