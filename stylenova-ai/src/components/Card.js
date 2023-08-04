import card_image from "../images/about-card-vector.png";

import "../style/boostrap.css";
import "../style/custom.css";

function RenderingArrayOfObjects({ languageData }) {
  const data = languageData.map((item) => {
    return {
      ...item,
      Image: card_image,
    };
  });


  const listItems = data.map((e, index) => {
    return (
      <div className="card text-white rounded" key={index}>
        <div className="card-image-container text-start p-3">
          <img src={e.Image} alt="image" className="img-fluid rounded" />
        </div>
        <div className="card-body d-flex flex-column">
          <h3 className="card-title">{e.title}</h3>
          <p className="card-text">{e.description} </p>
        </div>
      </div>
    );
  });
  return (
    <div className="card_container d-flex flex-row flex-wrap gap-3 justify-content-center">
      {listItems}
    </div>
  );
}
export const Card = ({ languageData }) => {
  return <RenderingArrayOfObjects languageData={languageData} />;
};
