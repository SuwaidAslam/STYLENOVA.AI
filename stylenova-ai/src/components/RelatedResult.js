import React, { Component } from "react";
import Carousel from "@itseasy21/react-elastic-carousel";

import arrowImg from "../images/RelatedArrow.png";

class RelatedResult extends Component {
  constructor(props) {
    super(props);
    this.breakPoints = [
      { width: 375, itemsToShow: 1, itemsToScroll: 1, pagination: false },
      { width: 768, itemsToShow: 2, itemsToScroll: 1 },
      { width: 992, itemsToShow: 4, itemsToScroll: 1 },
    ];
  }
  render() {
    const { products } = this.props;
    return (
      <div>
        <Carousel breakPoints={this.breakPoints}>
          {products.map((product, index) => {
            return (
              <a
                href={product.product_url} target="_blank" rel="noopener noreferrer"
                className="List-related-result text-white rounded mb-5 d-flex flex-row align-items-center w-75 px-2"
                key={index}
                style={{ textDecoration: 'none' }}
                draggable="false" // Disable dragging
              >
                <div className="List-image-container">
                  <img
                    src={product.product_image_url}
                    alt="image"
                    className="rounded img-fluid mx-auto d-block"
                  />
                </div>
                <div className="List-related-result-body d-flex text-start flex-column align-items-start px-3">
                  <h3>{product.product_name}</h3>
                  <h3>{product.product_price}</h3>
                  <img
                    src={arrowImg}
                    alt="Arrow"
                    className="rounded-circle img-fluid mx-auto d-block"
                  />
                </div>
              </a>
            );
          })}
        </Carousel>
      </div>
    );
  }
}
export default RelatedResult;
