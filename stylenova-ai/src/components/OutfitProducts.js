import React from 'react'
import { useState, useEffect } from 'react'
import ProductSlider from './ProductSlider'
import { Results } from "./Result";
import axios from 'axios';
import { API_URL } from '../utils/constants';


function OutfitProducts({ outfitId }) {
    const [products, setProducts] = useState([]);
    const [outfitImage, setOutfitImage] = useState('');

    useEffect(() => {
        getOutfitProducts();
        getOutfitImage();
    }, [outfitId]);

    const getOutfitImage = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/outfit/${outfitId}`);
            setOutfitImage(response.data.generated_image_url);
        } catch (error) {
            console.log(error);
        }
    };

    const getOutfitProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/products/${outfitId}`);
            setProducts(response.data.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Results image_url={outfitImage} />
            <ProductSlider products={products} />
        </>
    )
}

export default OutfitProducts