import SliderResult from './SliderResult';

import "../style/boostrap.css";
import "../style/custom.css";

function RenderingArrayOfObjects({ image_url, products }) {

    return (
        <div className='result_container'>
            <div className="container">
                <div className="row py-5 px-lg-5">
                    <div className="col-12">
                        <h3 className="mb-5 text-white">Result</h3>
                        <SliderResult image_url={image_url} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export const Results = ({ image_url, products }) => {
    return (
        < RenderingArrayOfObjects image_url={image_url} products={products} />
    )
}