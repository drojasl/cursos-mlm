import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles.css";
import axios from "../../../../axiosConfig";

import Icon from "@mdi/react";
import {
  mdiKeyVariant,
  mdiPlus,
  mdiMagnify,
  mdiAccountGroupOutline,
} from "@mdi/js";

const ProfileManagement = () => {
  const [courses, setCourses] = useState<any>([]);
  const [userData, setUserData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.post("/getAdminDataAndCourses", {
          userId: 1,
        });
        setCourses(response.data.courses);
        setUserData(response.data.userData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course: any) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-xl font-bold">Profile</h1>
      <div className="h-fit flex gap-4  mb-4">
        <div className="rounded-full bg-black h-[17em] w-[17em]"></div>
        <div className="shadow-md w-[30em] bg-white h-full rounded-xl p-3">
          <p className="font-bold text-[1.2em]">Profile Information</p>
          <div className="mt-4 flex flex-col gap-2">
            <p>
              <label className="font-bold text-xs">First Name: </label>
              <label className="text-sm opacity-50">{userData.name}</label>
            </p>
            <p>
              <label className="font-bold text-xs">Last Name: </label>
              <label className="text-sm opacity-50">{userData.last_name}</label>
            </p>
            <p>
              <label className="font-bold text-xs">Email: </label>
              <label className="text-sm opacity-50">{userData.email}</label>
            </p>
            <p>
              <label className="font-bold text-xs">Phone: </label>
              <label className="text-sm opacity-50">{userData.cellphone}</label>
            </p>
          </div>
        </div>
        <div className="shadow-md w-[30em] bg-white h-full rounded-xl p-3">
          <p className="font-bold text-[1.2em]">Social Information</p>
        </div>
        <div className="shadow-md w-[30em] bg-white h-full rounded-xl p-3">
          <p className="font-bold text-[1.2em]">Security Information</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Published Courses</h1>
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
        <Link to={`/home/manageCourses/createCourse`}>
          <div
            className="flex items-center gap-2 bg-[#215A4F] bg-opacity-20 rounded rounded-lg text-[#215A4F] px-2 py-1 cursor-pointer"
            style={{ border: "2px solid #215A4F" }}
          >
            <Icon path={mdiPlus} size={0.9} />
            <p>Create a Course</p>
          </div>
        </Link>
      </div>
      <div className="flex gap-4 h-full flex-wrap content-start">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course: any) => {
            return (
              <Link
                to={`/home/manageCourses/editCourse/${course?.id}`}
                className="flex bg-white rounded-xl w-[300px] h-fit flex flex-col gap-2 shadow-sm cursor-pointer"
                key={course?.token}
              >
                <div className="flex items-center justify-between px-3 pt-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Icon path={mdiAccountGroupOutline} size={0.8} />
                      <p className="opacity-40 font-bold">
                        {course?.total_access_code_used_count}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon path={mdiKeyVariant} size={0.8} />
                      <p className="opacity-40 font-bold">
                        {course?.access_code_count}
                      </p>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className="flex items-center justify-between px-3">
                  <div className="flex flex-col gap-1 justify-between w-full">
                    <p className="font-bold text-sm truncate max-w-[150px]">
                      {course?.title}
                    </p>
                    <p className="opacity-40 text-xs">
                      {course?.total_nodes} Nodes
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#F6F6F6] p-3 font-bold rounded-b-xl">
                  <p className="text-xs opacity-40">
                    Created at:{" "}
                    {new Date(course?.created_at).toLocaleDateString("en-CA")}
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

export default ProfileManagement;
