import React from "react";
import { Link } from "react-router-dom";

import "../style/boostrap.css";
import "../style/custom.css";

import Accordian from "./Accordion"
import Icon from "./icon"

export const Footer_Dextop_Nav = ({ languageData }) => {
  return (
    <div className="row footer-top py-5 text-center text-md-start">
      <div className="footer-top-container col-12 col-md-6 d-flex flex-column justify-content-between text-start align-items-center">
        <h3 className="text-left mb-5 w-100">STYLENOVA.AI</h3>
        {/* <Accordian /> */}
        <Icon />
      </div>
      {/* <div className="d-none d-md-flex col-md-2 d-flex flex-column gap-3">
        <h4>Product</h4>
        <Link className="header_data_a text-dark text-decoration-none" to="/product_overview"> Overview</Link>
        <Link className="header_data_a text-dark text-decoration-none" to="/customer_stories"> Customer Stories</Link>
        <Link className="header_data_a text-dark text-decoration-none" to="/safety_standerds"> Safety Standards</Link>
      </div> */}
      {/* <div className="d-md-flex col-md-2 d-flex flex-column gap-3">
        <h4>Research</h4>
        <Link className="header_data_a text-dark text-decoration-none" to="/reserch_overview"> Overview</Link>
        <Link className="header_data_a text-dark text-decoration-none" to="/index_"> Index </Link>
      </div>
      <div className="d-md-flex col-md-2 d-flex flex-column gap-3">
        <h4>Company</h4>
        <Link className="header_data_a text-dark text-decoration-none" to="/about_" > About</Link>
        <Link className="header_data_a text-dark text-decoration-none" to="/blog_"> Blog </Link>
        <Link className="header_data_a text-dark text-decoration-none" to="/career_"> Career </Link>
      </div> */}
      <div className="d-md-flex col-md-2 d-flex flex-column gap-3">
        <h4>Legal</h4>
        <Link className="header_data_a text-dark text-decoration-none" to="/imprint"> {languageData.imprint_link}</Link>
      </div>
    </div>
  );
};

export default Footer_Dextop_Nav;
