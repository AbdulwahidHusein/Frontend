import { RegistrationData } from "@/types/types";
import axios from "axios";
import { ENDPOINTS } from "../config";

const registerUser = async (data: RegistrationData) => {
  try {
    const res = await axios.post(ENDPOINTS.REGISTER, data);
    return res.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    
    if (error.response?.data) {
      // Handle specific validation errors
      if (error.response.data.email) {
        throw new Error(`Email error: ${error.response.data.email[0]}`);
      } else if (error.response.data.password) {
        throw new Error(`Password error: ${error.response.data.password[0]}`);
      } else if (error.response.data.non_field_errors) {
        throw new Error(error.response.data.non_field_errors[0]);
      }
      
      // Handle other field errors
      const firstError = Object.entries(error.response.data)[0];
      if (firstError) {
        const [field, messages] = firstError;
        const message = Array.isArray(messages) ? messages[0] : messages;
        throw new Error(`${field}: ${message}`);
      }
    }
    
    throw new Error("Registration failed. Please try again.");
  }
};

export default registerUser;
