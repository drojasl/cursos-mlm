import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiChevronLeft,
  mdiDotsHorizontal,
  mdiEyeOutline,
  mdiArrowExpandLeft,
  mdiArrowExpandRight,
} from "@mdi/js";

const CoursePlayer = () => {
  const YOUTUBE_BASE_URL = "https://www.youtube.com/embed/";

  const { token } = useParams();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [courseData, setCourseData] = useState<any>({
    title: "",
    nodes: [],
  });

  useEffect(() => {
    const courseTokens = localStorage.getItem("course_tokens");
    const courseDataStored = localStorage.getItem("course_data");

    const tokens = courseTokens ? JSON.parse(courseTokens) : [];
    const courseDataMap = courseDataStored ? JSON.parse(courseDataStored) : {};

    if (tokens.includes(token)) {
      setIsTokenValid(true);

      const courseData = courseDataMap[token];
      if (courseData) {
        setCourseData(courseData);

        // Restaurar el índice de la lección actual específico para este curso
        const savedLessonIndexMap = localStorage.getItem(
          "currentLessonIndexes"
        );
        const savedLessonIndexes = savedLessonIndexMap
          ? JSON.parse(savedLessonIndexMap)
          : {};
        const savedLessonIndex = savedLessonIndexes[token] || 0;
        setCurrentLessonIndex(parseInt(savedLessonIndex));
      } else {
        navigate("/home");
      }
    } else {
      navigate("/home");
    }
  }, [token, navigate]);

  if (!isTokenValid) {
    return null;
  }

  const handleNext = () => {
    if (currentLessonIndex < courseData.nodes.length - 1) {
      setCurrentLessonIndex((prevIndex) => {
        const newIndex = prevIndex + 1;

        const updatedNodes = courseData.nodes.map(
          (lesson: any, index: number) =>
            index === prevIndex ? { ...lesson, played: true } : lesson
        );

        // Guardar los datos del curso actualizados en localStorage para este token
        const courseDataMap = JSON.parse(
          localStorage.getItem("course_data") || "{}"
        );
        courseDataMap[token] = { ...courseData, nodes: updatedNodes };
        localStorage.setItem("course_data", JSON.stringify(courseDataMap));

        // Guardar el nuevo índice de la lección actual para este curso
        const savedLessonIndexMap = localStorage.getItem(
          "currentLessonIndexes"
        );
        const savedLessonIndexes = savedLessonIndexMap
          ? JSON.parse(savedLessonIndexMap)
          : {};
        savedLessonIndexes[token] = newIndex;
        localStorage.setItem(
          "currentLessonIndexes",
          JSON.stringify(savedLessonIndexes)
        );

        setCourseData({ ...courseData, nodes: updatedNodes });

        return newIndex;
      });
    }
  };

  const handleBack = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prevIndex) => {
        const newIndex = prevIndex - 1;

        // Actualizar el índice de la lección en localStorage para este curso
        const savedLessonIndexMap = localStorage.getItem(
          "currentLessonIndexes"
        );
        const savedLessonIndexes = savedLessonIndexMap
          ? JSON.parse(savedLessonIndexMap)
          : {};
        savedLessonIndexes[token] = newIndex;
        localStorage.setItem(
          "currentLessonIndexes",
          JSON.stringify(savedLessonIndexes)
        );

        return newIndex;
      });
    }
  };

  const currentLesson = courseData.nodes[currentLessonIndex];

  return (
    <div className="flex flex-col max-h-screen h-screen bg-[#F6F7F9]">
      <header className="flex items-center gap-2 font-bold bg-[#F3F3F3] p-3">
        <Link to="/home/courses/coursesList" className="flex items-center">
          <Icon path={mdiChevronLeft} size={1} />
        </Link>
        <p>
          {courseData.title} - {currentLesson.title}
        </p>
      </header>
      <div className="flex-grow w-full py-3 px-20 flex flex-col justify-center gap-4">
        <div className="grid grid-cols-12 w-full gap-4">
          <div className="col-span-12">
            <p className="text-xl font-bold">COURSE - {courseData.title}</p>
          </div>
          <div
            className={`${
              isSidebarExpanded ? "col-span-9" : "col-span-11"
            } grid grid-cols-12 gap-4`}
          >
            <div
              className={`h-[70vh] rounded-xl items-center justify-center flex bg-black col-span-12`}
            >
              <iframe
                src={`${YOUTUBE_BASE_URL}${currentLesson.video_url}&controls=0&rel=0&showinfo=0&autoplay=1`}
                className="w-full h-full object-cover rounded-xl"
                title={currentLesson.title}
                allowFullScreen
              ></iframe>
            </div>
            <div className="col-span-12 flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div>
                  <p className="font-bold text-[1.3em]">
                    {currentLesson.title}
                  </p>
                  <p className="opacity-50">
                    {courseData?.user?.name} {courseData?.user?.last_name}
                  </p>
                </div>
              </div>
              <div>
                <Icon path={mdiDotsHorizontal} size={1} />
              </div>
            </div>
          </div>
          <div
            className={`${
              isSidebarExpanded
                ? "col-span-3"
                : "col-span-1 flex flex-col items-center"
            } h-full transition-all duration-300`}
          >
            <div className="flex items-center gap-2 justify-between">
              <p className={`font-bold text-[1.3em]`}>Lessons</p>
              <div
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="cursor-pointer"
              >
                <Icon
                  path={
                    isSidebarExpanded ? mdiArrowExpandRight : mdiArrowExpandLeft
                  }
                  size={0.6}
                />
              </div>
            </div>
            <div className="my-4 relative">
              {courseData.nodes.map((lesson: any, index: number) => (
                <div key={lesson.id} className="relative">
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-6 h-6 rounded-full z-10 relative flex items-center justify-center ${
                        index === currentLessonIndex
                          ? "bg-[#675FFC] bg-opacity-20 text-[#675FFC]"
                          : lesson.played
                          ? "bg-[#215A4F] bg-opacity-20 text-[#215A4F]"
                          : "bg-[#E0E0E0] bg-opacity-20 text-[#BDBDBD]"
                      }`}
                      style={{
                        border: `2px solid ${
                          index === currentLessonIndex
                            ? "#675FFC"
                            : lesson.played
                            ? "#215A4F"
                            : "#BDBDBD"
                        }`,
                      }}
                    >
                      <Icon path={mdiEyeOutline} size={0.5} />
                    </div>
                    {isSidebarExpanded && (
                      <p
                        className="font-bold flex-1 cursor-pointer"
                        onClick={() =>
                          setCurrentLessonIndex(
                            courseData.nodes.findIndex(
                              (l: any) => l.id === lesson.id
                            )
                          )
                        }
                      >
                        {lesson.title}
                      </p>
                    )}
                  </div>
                  {lesson.id !==
                    courseData.nodes[courseData.nodes.length - 1].id && (
                    <div className="w-6 h-6 flex justify-center">
                      <div className="h-full w-[2px] bg-[#BDBDBD]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {isSidebarExpanded && (
              <div className="flex w-full gap-2">
                <div
                  className="hover:bg-[#215A4F] px-4 rounded-md py-2 hover:text-white text-[#215A4F] font-bold cursor-pointer w-[50%] flex items-center justify-center"
                  onClick={handleBack}
                >
                  Back
                </div>
                <div
                  className="bg-[#215A4F] px-4 rounded-md py-2 text-white font-bold cursor-pointer w-[50%] flex items-center justify-center"
                  onClick={handleNext}
                >
                  Next
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
