import React from 'react';
import OutfitProducts from '../components/OutfitProducts';
import { useParams } from 'react-router-dom'
import Navbar from "../Sections/Navbar";

const Products = () => {
    const { outfitId } = useParams();
    return (
        <>
            <Navbar />
            <div className="data_container py-3 py-lg-5">
                <OutfitProducts outfitId={outfitId} />
            </div>
        </>
    );
};

export default Products;
