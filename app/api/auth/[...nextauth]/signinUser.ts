import axios from "axios";
import { ENDPOINTS } from "@/lib/config";

async function signinUser(email: string, password: string) {
  try {
    const response = await axios.post(ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error signing in:", error.response?.data || error.message);
    
    // Handle specific error cases from the backend
    if (error.response?.data) {
      if (error.response.data.non_field_errors) {
        throw new Error(error.response.data.non_field_errors[0]);
      } else if (error.response.data.email) {
        throw new Error(`Email error: ${error.response.data.email[0]}`);
      } else if (error.response.data.password) {
        throw new Error(`Password error: ${error.response.data.password[0]}`);
      } else if (error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    
    // If no specific error message is found, throw a generic error
    throw new Error("An error occurred during sign in. Please try again.");
  }
}

export default signinUser;
