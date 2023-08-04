import { Link } from "react-router-dom";

import "../style/boostrap.css";
import "../style/custom.css";

export const Accordian = () => {
  return (
    <div className="d-md-none accordion w-100 mb-5" id="accordionExample">
      <div className="accordion-item border-0">
        <h2 className="accordion-header" id="headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Product
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body d-flex flex-column gap-3">
            <Link className="header_data_a text-dark text-decoration-none" to="/product_overview">Overview</Link>
            <Link className="header_data_a text-dark text-decoration-none" to="/customer_stories" >Customer Stories </Link>
            <Link className="header_data_a text-dark text-decoration-none" to="/safety_standerds"> Safety Standards </Link>
          </div>
        </div>
      </div>
      <div className="accordion-item border-0">
        <h2 className="accordion-header" id="headingTwo">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            Research
          </button>
        </h2>
        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
          <div className="accordion-body d-flex flex-column gap-3">
            <Link className="header_data_a text-dark text-decoration-none" to="/reserch_overview"> Overview</Link>
            <Link className="header_data_a text-dark text-decoration-none" to="/index_"> Index </Link>
          </div>
        </div>
      </div>
      <div className="accordion-item border-0">
        <h2 className="accordion-header" id="headingThree">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            Company
          </button>
        </h2>
        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample" >
          <div className="accordion-body d-flex flex-column gap-3">
            <Link className="header_data_a text-dark text-decoration-none" to="/about_" > About </Link>
            <Link className="header_data_a text-dark text-decoration-none" to="/blog_"> Blog </Link>
            <Link className="header_data_a text-dark text-decoration-none" to="/career_"> Career</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordian;
