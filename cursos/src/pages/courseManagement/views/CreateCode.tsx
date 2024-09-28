import { useState, useEffect } from "react";
import CreateCodeForm from "../components/CreateCodeForm";
import CodesList from "../components/CodesList";

import "../styles.css";
import axios from "../../../../axiosConfig";

const CreateCourse = () => {
  const [courses, setCourses] = useState<any>([]);
  const [refreshCodes, setRefreshCodes] = useState<boolean>(false);

  useEffect(() => {
    const getUserCourses = async () => {
      try {
        const response = await axios.post("/getUserCourses/", {
          userId: 1,
        });

        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          console.error("Error al obtener los cursos del usuario.");
        }
      } catch (error) {
        console.error("Hubo un error al hacer la solicitud:", error);
      }
    };

    getUserCourses();
  }, []);

  const handleCodeAdded = () => {
    setRefreshCodes(!refreshCodes);
  };

  return (
    <div className="h-full font-bold rounded-2xl flex gap-4 relative">
      <CreateCodeForm courses={courses} onCodeAdded={handleCodeAdded} />
      <CodesList refresh={refreshCodes} />
    </div>
  );
};

export default CreateCourse;
