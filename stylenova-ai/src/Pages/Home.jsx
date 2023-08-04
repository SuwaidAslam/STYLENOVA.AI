import React from 'react';
import { UserData } from "../Sections/UserData";
import { AboutUs } from "../Sections/AboutUs";
import { LatestOutfit } from "../Sections/LatestOutfit";
import { Subscribe } from "../Sections/Subscribe";
import { EmailUs } from '../Sections/EmailUs';
import Navbar from "../Sections/Navbar";

const Home = ({ languageData }) => {
  return (
    <>
      <Navbar />
      <UserData languageData={languageData.form_section} />
      <LatestOutfit languageData={languageData.last_outfits_section} />
      <AboutUs languageData={languageData.aboutus_section} />
      <EmailUs languageData={languageData.contactus_section} />
      <Subscribe languageData={languageData.subscribe_section} />
    </>

  );
};

export default Home;
