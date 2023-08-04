import { useState } from "react";

import Form from "react-bootstrap/Form";

import "../style/boostrap.css";
import "../style/custom.css";
import axios from "axios";
import toast from 'react-hot-toast';
import { API_URL } from "../utils/constants";

export const ContactForm = ({languageData}) => {
  const [SenderName, setSenderName] = useState("");
  const [SenderEmail, setSenderEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API_URL}/api/subscribe_newsletter`, {
        "name": SenderName,
        "email": SenderEmail,
      });
      
      console.log("User info sent to backend.");
      setSenderName("");
      setSenderEmail("");
      toast.success('You have successfully subscribed to our newsletter!');
      // Display success message or perform any other actions on success
    } catch (error) {
      console.log("An error occurred while sending user info:", error);
      toast.error('An error occurred while subscribing to our newsletter!');
      // Display error message or perform any other error handling
    }
  };
  
  return (
    <div className="contact_form_container w-100">
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <Form.Group>
            <input
              type="text"
              className="form-control bg-transparent text-white text-center btn_form"
              id="exampleInputname"
              placeholder={languageData.name}
              value={SenderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="form-group mb-4">
          <Form.Group>
            <input
              type="email"
              className="form-control bg-transparent text-white text-center btn_form"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder={languageData.email}
              value={SenderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </Form.Group>
        </div>
        <button
          type="submit"
          className="btn btn-primary bg-white text-black w-50 border mb-5"
        >
          {languageData.subscribe_button}
        </button>
      </form>
    </div>
  );
};
