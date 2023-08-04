import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Imprint from "./Pages/Imprint";
import { Toaster } from 'react-hot-toast';
import Footer from "./Sections/Footer";
import axios from 'axios';
import { API_URL } from "./utils/constants";
import { useEffect, useState } from 'react';

function App() {
  const [languageData, setLanguageData] = useState(null);
  const [userCountryCode, setUserCountryCode] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/get_country`);
        setUserCountryCode(response.data.countryCode);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountryData();
  }, []);

  useEffect(() => {
    const fetchLanguageData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/language/${userCountryCode}`);
        setLanguageData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (userCountryCode) {
      fetchLanguageData();
    }
  }, [userCountryCode]);

  return (
    <div className="App">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <BrowserRouter>
        <div className='"Home_Container'>
          <Routes>
            {languageData && <Route path="/" element={<Home languageData={languageData.home_page} />} />}
            {languageData && <Route path="/imprint" element={<Imprint />} />}
            {languageData && <Route path="/products/:outfitId" element={<Products />} />}
          </Routes>
          {languageData && <Footer languageData={languageData.footer} />}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
