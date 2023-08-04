import { Link } from "react-router-dom";
import menu_logo from "../images/menu-vector.png";

import "../style/boostrap.css";

export const NavBar_links = () => {
  return (
        <div className="col-6 d-flex align-items-center justify-content-end">
            <div className="d-none d-md-flex header-data d-flex gap-5">
            {/* <Link className="header_data_a text-white text-decoration-none" to="/join_now"> Join Now </Link>
            <Link className="header_data_a text-white text-decoration-none"to="/sign_in" > Sign In </Link> */}
            </div>
            <div className="d-md-none header-data d-flex gap-5">
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle bg-transparent border-0" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={menu_logo} alt="logo" className="img-fluid" />
                </button>
                <div className="dropdown-menu bg-transparent" aria-labelledby="dropdownMenuButton">
                {/* <Link className="dropdown-item header_data_a text-white text-decoration-none" to="/join_now"> Join Now </Link>
                <Link className="dropdown-item header_data_a text-white text-decoration-none" to="/sign_in" > Sign In </Link> */}
                </div>
            </div>
            </div>
        </div>
  );
};

export default NavBar_links;