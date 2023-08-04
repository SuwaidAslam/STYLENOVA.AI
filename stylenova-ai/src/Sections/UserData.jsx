import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import search_vector from "../images/search-vector.png";
import { Results } from "../components/Result";
import "../style/boostrap.css";
import "../style/custom.css";
import { Link } from 'react-router-dom';


import axios from "axios";
import { API_URL } from "../utils/constants";
import toast from 'react-hot-toast';
import ProductSlider from "../components/ProductSlider";
import Loader from "../components/Loader";



export const UserData = ({ languageData }) => {
  const [clickedButtonIndex, setClickedButtonIndex] = useState(null);
  const [clickedButtonGender, setClickedButtonGender] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageURL, setSelectedImageURl] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [german_keywords, setGerman_keywords] = useState(null);
  const [products, setProducts] = useState([]);
  const [recordId, setRecordId] = useState(null);
  const [description, setDescription] = useState(null);
  const [input_image_url, setInput_image_url] = useState(null);
  const [body_type, setBody_type] = useState("");
  const [season, setSeason] = useState("");
  const [productsInserted, setProductsInserted] = useState(false);

  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsFetched, setProductsFetched] = useState(null);
  const [product_keywords, setProduct_keywords] = useState(null);
  const [prompt, setPrompt] = useState(null);


  const handleError = (error) => {
    console.error("An error occurred:", error);
    toast.error(error); // Show error toast notification
  };


  const ShownResult = async (event) => {
    event.preventDefault();

    // Check if style, gender, and age are provided
    if (!selectedStyle || !selectedGender || !age) {
      // Handle the case when any of the mandatory fields are missing
      console.log("Please provide values for style, gender, and age.");
      toast.error("Please provide values for style, gender, and age."); // Show error toast notification
      return;
    }
    setIsLoadingImage(true);
    setIsLoadingProducts(true);
    setGeneratedImage(null);
    setProducts([]);
    try {
      const formData = new FormData();
      formData.append("style", selectedStyle);
      formData.append("gender", selectedGender);
      formData.append("age", age);
      formData.append("height", height);
      formData.append("weight", weight);
      formData.append("body_type", body_type);
      formData.append("season", season);

      const chatGptResponse = await axios.post(
        `${API_URL}/api/get_chatgpt_response`,
        formData
      );
      const { keywords, description, german_keywords, prompt } = chatGptResponse.data;

      setKeywords(keywords);
      setDescription(description);
      setGerman_keywords(german_keywords);
      setPrompt(prompt);
    } catch (error) {
      handleError(error);
    }
  };


  useEffect(() => {
    const getLeonardoResponse = async () => {
      if (description) {
        try {
          const formData = new FormData();
          formData.append("image", selectedImage);
          formData.append("description", description);

          const leonardoResponse = await axios.post(`${API_URL}/api/get_leonardo_response`, formData);
          const { input_image_url, generated_image_url } = leonardoResponse.data;

          setInput_image_url(input_image_url);
          setGeneratedImage(generated_image_url);
          setIsLoadingImage(false);
        } catch (error) {
          setIsLoadingImage(false);
          handleError(error);
        }
      }
    };

    getLeonardoResponse();
  }, [description]);

  useEffect(() => {
    const submitImageDetails = async () => {
      if (generatedImage) {
        try {
          const formData = new FormData();
          formData.append("input_image_url", input_image_url);
          formData.append("style", selectedStyle.name);
          formData.append("gender", selectedGender.name);
          formData.append("age", age);
          formData.append("height", height);
          formData.append("weight", weight);
          formData.append("description", description);
          formData.append("keywords", keywords);
          formData.append("generated_image_url", generatedImage);
          formData.append("body_type", body_type);
          formData.append("season", season);
          formData.append("prompt", prompt);
          
          const response = await axios.post(`${API_URL}/api/submit_image_details`, formData);
          const { record_id } = response.data;

          setRecordId(record_id);
        } catch (error) {
          handleError(error);
        }
      }
    };

    submitImageDetails();
  }, [generatedImage]);

  useEffect(() => {
    setProduct_keywords(keywords);
    if (german_keywords) {
      setProduct_keywords(german_keywords);
    }
  }, [keywords, german_keywords]);


  useEffect(() => {
    const getProducts = async () => {
      if (product_keywords) {
        try {
          const keywordArray = product_keywords.split(',');

          for (const keyword of keywordArray) {
            try {
              const response = await axios.post(`${API_URL}/api/get_products`, {
                keyword: keyword.trim(),
              });

              if (response.error) {
                console.log(response.error);
              } else {
                setProducts(prevProducts => [...prevProducts, ...response.data]);
              }
            } catch (error) {
              // Handle the error here
              console.log(error);
            }
          }
          setIsLoadingProducts(false);
          setProductsFetched(true);
          // const requests = keywordArray.map((keyword) => {
          //   return axios.post(`${API_URL}/api/get_products`, {
          //     keyword: keyword.trim(),
          //   });
          // });

          // const responses = await Promise.all(requests);
          // const product_list = responses.flatMap((response) => {
          //   if (response.error) {
          //     console.log(response.error);
          //     return [];
          //   }
          //   return response.data;
          // });

          // setProducts(product_list);
        } catch (error) {
          setIsLoadingProducts(false);
          handleError(error);
        }
      }
    };

    getProducts();
  }, [product_keywords]);


  useEffect(() => {
    const saveProducts = async () => {
      if (products && recordId) {
        try {
          const saveData = {
            products: products,
            id: recordId,
          };

          const response = await axios.post(`${API_URL}/api/save_products`, saveData);
          setProductsInserted(true);
          console.log(response.data.message);
        } catch (error) {
          handleError(error);
        }
      }
    };

    saveProducts();
  }, [productsFetched]);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImageURl(URL.createObjectURL(file));
    setSelectedImage(file);
  };

  const HandleBtn = (index, name) => {
    setClickedButtonIndex(index);
    setSelectedStyle(name);
  };
  const HandleGender = (index, gendername) => {
    setClickedButtonGender(index);
    setSelectedGender(gendername);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleBodyTypeSelection = (btype) => {
    setBody_type(btype);
  };

  const handleSeasonSelection = (season) => {
    setSeason(season);
  };

  return (
    <div className="data_container py-3 py-lg-5">
      {/* {isLoading && <Loader />} */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-5"></h2>

            <form onSubmit={handleSubmit}>
              <div className="form_container d-flex flex-column justify-content-center align-items-center">
                {/*  Click to Image for Upload.... */}
                <div className="imageUploader_container w-100">
                  <label
                    htmlFor="upload"
                    className="upload-button mb-5 btn_form border-dashed"
                  >
                    {languageData.upload_photo_title}
                    <input
                      type="file"
                      id="upload"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div className="Image_Selected_Result mb-5">
                  {selectedImageURL && (
                    <div className="image-select-img">
                      <img
                        src={selectedImageURL}
                        alt="Uploaded"
                        className="img-fluid rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="SelectStyle_container">
                  <h3 className="text-white">{languageData.style_field.style_title}</h3>

                  {/* SearchBar...... */}
                  {/* <div className="search_container d-flex flex-row justify-content-center align-items-center mb-5 btn_form">
                    <img
                      src={search_vector}
                      alt="search"
                      className="img-fluid"
                    />
                    <Form.Group>
                      <Form.Control
                        type="search"
                        icon="search"
                        placeholder={
                          selectedStyle ? selectedStyle.name : "find style"
                        }
                      />
                    </Form.Group>
                  </div> */}

                  {/* SearchBar options..... */}
                  <div className="button_container mb-4 d-flex justify-content-center gap-2 flex-wrap">
                    {languageData.style_field.styles.map((item, index) => {
                      const btnClasses = `styleBtn${clickedButtonIndex === index ? " active" : ""}`;
                      const translated_style = languageData.style_field.styles_translated[index];

                      return (
                        <button
                          onClick={() => HandleBtn(index, item)}
                          key={index}
                          className={btnClasses}
                        >
                          {translated_style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* About..... */}
                <div className="AboutYou_container">
                  <h3 className="text-white">{languageData.gender_field.gender_title}</h3>
                  <div
                    className="button_container mb-3 d-flex justify-content-center gap-2"
                    style={{ width: "100%" }}
                  >
                    <div className="button_container mb-3 d-flex justify-content-center gap-1 flex-wrap">
                      {languageData.gender_field.genders.map((item, index) => {
                        const btnClasses = `stylegender${clickedButtonGender === index ? " active" : ""}`;
                        const translated_gender = languageData.gender_field.genders_translated[index];

                        return (
                          <button
                            onClick={() => HandleGender(index, item)}
                            key={index}
                            className={btnClasses}
                            style={{ width: "150px" }} // Adjust the width as per your requirement
                          >
                            {translated_gender}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="row">
                    {/* Height */}
                    <div className="col-md">
                      <div className="height_container btn_form">
                        <Form.Group>
                          <Form.Control
                            type="number"
                            placeholder={languageData.height_field.height_title}
                            min={0}
                            max={200}
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                          />
                        </Form.Group>
                        <p className="text-white mb-0">{languageData.height_field.height_unit}</p>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="col-md">
                      <div className="height_container btn btn_form">
                        <Form.Group>
                          <Form.Control
                            type="number"
                            placeholder={languageData.weight_field.weight_title}
                            min={0}
                            max={200}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                          />
                        </Form.Group>
                        <p className="text-white mb-0">{languageData.weight_field.weight_unit}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Dropdown 1 Body Type */}
                    <div className="col-md">
                      <div className="height_container">
                        <Form.Group>
                          <Form.Select
                            className="form-control btn dropdown-select"
                            value={body_type}
                            onChange={(e) => handleBodyTypeSelection(e.target.value)}
                          >
                            <option value="">{languageData.body_type_field.body_type_title}</option>
                            {languageData.body_type_field.body_types.map((option, index) => (
                              <option key={index} value={option}>{languageData.body_type_field.body_types_translated[index]}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </div>

                    {/* Dropdown 2 Season*/}
                    <div className="col-md">
                      <div className="height_container">
                        <Form.Group>
                          <Form.Select
                            className="form-control btn dropdown-select"
                            value={season}
                            onChange={(e) => handleSeasonSelection(e.target.value)}
                          >
                            <option value="">{languageData.season_field.season_field_title}</option>
                            {languageData.season_field.seasons.map((option, index) => (
                              <option key={index} value={option}>{languageData.season_field.seasons_translated[index]}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                  {/* Age........... */}
                  <div className="height_container btn_form">
                    <Form.Group>
                      <Form.Control
                        type="number"
                        placeholder={languageData.age_field.age_title}
                        min={0}
                        max={100}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </Form.Group>
                    <p className="text-white mb-0">{languageData.age_field.age_unit}</p>
                  </div>
                </div>

                {/* Generate Style... */}
                <Button variant="primary" type="submit" onClick={ShownResult}>
                  {languageData.generate_button_title}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* 👇️ Result show on click */}
      {/* {isLoading && <h5>Please wait… the generation can take up to 20 seconds</h5>} */}
      <div>
        {isLoadingImage && <Loader text={"Generating Outfit..."} />}
        {generatedImage && <Results image_url={generatedImage} />}

        {productsInserted && <Link to={`/products/${recordId}`}>{window.location.href}/products/{recordId}</Link>}

        {isLoadingProducts && <Loader text={"Fetching Products..."} />}
        {products && <ProductSlider products={products} />}
      </div>
    </div>
  );
};
