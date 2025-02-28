import axios from "axios";
import { ENDPOINTS } from "../config";

const fetch = async ({
  nextUrl,
  job_title,
  work_arrangement,
  job_type,
}: {
  nextUrl: string | null;
  job_title: string | null;
  work_arrangement: string | null;
  job_type: string | null;
}) => {
  const baseURL = nextUrl || ENDPOINTS.JOBS;
  if (job_title || work_arrangement) {
    const url = `${baseURL}?job_title=${job_title}&work_arrangement=${work_arrangement}&job_type=${job_type}`;
    const res = await axios.get(url);
    return res.data;
  }
  const res = await axios.get(baseURL);
  return res.data;
};

export default fetch;
