import axios from "axios";

export const runCode = async (code, language) => {

  const res = await axios.post(
    "http://localhost:5000/api/code/run",
    {
      code,
      language
    }
  );

  return res.data;
};