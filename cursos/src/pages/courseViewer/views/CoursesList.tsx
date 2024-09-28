import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Courses.css";
import { PieChart } from "@mui/x-charts/PieChart";

import Icon from "@mdi/react";
import { mdiMagnify, mdiPlus } from "@mdi/js";

const CoursesList = () => {
  const [courses, setCourses] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const existingCourseData = localStorage.getItem("course_data");

    if (existingCourseData) {
      const parsedCourseData = JSON.parse(existingCourseData);

      const courseArray = Object.entries<any>(parsedCourseData).map(
        ([token, course]) => {
          const lessonsCount = Array.isArray(course.nodes)
            ? course.nodes.length
            : 0;

          const playedLessons = Array.isArray(course.nodes)
            ? course.nodes.filter((node: any) => node.played === true).length
            : 0;

          return {
            user: course.user,
            token,
            title: course.title,
            lessonsCount,
            playedLessons,
          };
        }
      );

      setCourses(courseArray);
    }
  }, []);

  const calculateProgress = (playedLessons: number, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    return (playedLessons / totalLessons) * 100;
  };

  const filteredCourses = courses.filter((course: any) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Courses List</h1>
          <div className="flex bg-white px-2 rounded-lg items-center gap-2">
            <Icon path={mdiMagnify} size={0.9} className="opacity-20" />
            <input
              type="text"
              placeholder="Search a course"
              className="min-w-[20em] py-2 border-none focus:border-transparent focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Link to={`/home/courses/coursesAccess`}>
          <div
            className="flex items-center gap-2 bg-[#215A4F] bg-opacity-20 rounded rounded-lg text-[#215A4F] px-2 py-1 cursor-pointer"
            style={{ border: "2px solid #215A4F" }}
          >
            <Icon path={mdiPlus} size={0.9} />
            <p>Join a Course</p>
          </div>
        </Link>
      </div>
      <div className="flex gap-4 mt-10 h-full flex-wrap content-start">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course: any) => {
            const progress = calculateProgress(
              course.playedLessons,
              course.lessonsCount
            );
            return (
              <Link
                to={`/home/courses/course/${course.token}`}
                className="flex bg-white rounded-xl w-[300px] h-fit flex flex-col gap-4 shadow-sm cursor-pointer"
                key={course.token}
              >
                <div className="flex items-center justify-between pt-3 px-3">
                  <div className="flex flex-col gap-1 justify-between w-full">
                    <p className="font-bold text-sm truncate max-w-[150px]">
                      {course.title}
                    </p>
                    <p className="opacity-40 text-xs">
                      {course.lessonsCount} Lessons
                    </p>
                  </div>
                  <div className="w-12 h-12 relative flex justify-end ml-2">
                    <PieChart
                      series={[
                        {
                          data: [
                            { id: 0, value: progress, label: "Completed" },
                            {
                              id: 1,
                              value: 100 - progress,
                              label: "Remaining",
                            },
                          ],
                        },
                      ]}
                      width={10000}
                      height={10000}
                      colors={["#215A4F", "#F6F6F6"]}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#F6F6F6] p-3 font-bold rounded-b-xl">
                  <p className="text-xs opacity-40">
                    {course?.user?.name} {course?.user?.last_name}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-12 flex items-center justify-center">
            <p className="font-bold">You don't have any courses yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
