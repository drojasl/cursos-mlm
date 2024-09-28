import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronLeft } from "@mdi/js";
import axios from "../../../../axiosConfig";
import "../Courses.css";

const AccessCode = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const getCourse = async () => {
    try {
      const existingTokens = localStorage.getItem("course_tokens");
      const tokens = existingTokens ? JSON.parse(existingTokens) : [];

      const existingCourseData = localStorage.getItem("course_data");
      const courseDataMap = existingCourseData
        ? JSON.parse(existingCourseData)
        : {};

      const payload = { code, tokens };

      const response = await axios.post("/getCourse", payload);

      if (response.data.success) {
        const courseData = response.data.course_data;
        const newToken = response.data.token;

        if (!tokens.includes(newToken)) {
          tokens.push(newToken);
          localStorage.setItem("course_tokens", JSON.stringify(tokens));
        }

        courseDataMap[newToken] = courseData;
        localStorage.setItem("course_data", JSON.stringify(courseDataMap));

        navigate(`/home/course/${newToken}`);
      } else {
        console.error("Código de curso incorrecto");
      }
    } catch (error) {
      console.error("Error checking access code:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-3">
      <div className="w-full">
        <Icon path={mdiChevronLeft} size={1} />
      </div>
      <div className="flex-grow w-full items-center justify-center flex">
        <div className="rounded-xl bg-white p-4 gap-3 flex flex-col items-center">
          <p className="font-bold">Type the course code</p>
          <input
            type="text"
            placeholder="A3DE44"
            className="bg-[#F1F1F1] p-2 rounded-md w-[20em] text-center"
            onChange={(e) => setCode(e.target.value)}
          />
          <div
            className="bg-black px-4 rounded-md py-2 text-white font-bold cursor-pointer w-full flex items-center justify-center"
            onClick={getCourse}
          >
            Get in
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCode;
