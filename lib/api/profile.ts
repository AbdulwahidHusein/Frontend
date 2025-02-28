import axios from "axios";
import { ENDPOINTS } from "../config";

const createProfile = async (formData: FormData, token: string) => {
  const res = await axios.post(ENDPOINTS.PROFILE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const updateProfile = async (formData: FormData, token: string) => {
  const res = await axios.put(ENDPOINTS.PROFILE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getProfile = async (token: string) => {
  const res = await axios.get(ENDPOINTS.PROFILE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export { createProfile, updateProfile, getProfile };
