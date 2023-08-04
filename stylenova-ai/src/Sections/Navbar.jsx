import React, { useRef } from "react";
import ScrolImg from "../images/MouseMinimalistic.png";
import "../style/boostrap.css";
import NavBarlinks from "../components/NavBar_inks";

export const Navbar = () => {
  const scrollToRef = useRef(null);

  const handleButtonClick = () => {
    scrollToRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="banner_container">
      <div className="header bg-transparent" id="header">
        <div className="container">
          <div className="row mb-2 py-3 px-lg-5">
            <div className="col-6 text-start text-white">
              <h1>STYLENOVA.AI</h1>
            </div>

            <NavBarlinks />
          </div>
          <div className="row justify-content-center">
            <button
              className="btn btn-primary ScrolDown_button"
              onClick={handleButtonClick}
              style={{ width: "150px" }}
            >
              <p>Scroll to bottom</p>
              <img src={ScrolImg} alt="img" />
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: "120vh", width: "100%" }}></div>
      <div ref={scrollToRef} style={{ height: "100vh" }}></div>
    </div>
  );
};

export default Navbar;
