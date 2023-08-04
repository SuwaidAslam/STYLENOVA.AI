import RelatedResult from '../components/RelatedResult'
import React from 'react'

import "../style/boostrap.css";
import "../style/custom.css";


function ProductSlider({products}) {
    return (
        <div className='result_container'>
            <div className="container">
                <div className="row py-5 px-lg-5">
                    <div className='col-12'>
                        <div className='related-result-container'>
                            <RelatedResult products={products} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductSlider