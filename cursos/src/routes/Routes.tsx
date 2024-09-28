import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import CoursePlayerLayout from "@/layouts/CoursePlayerLayout";

import { HomeScreen } from "@/pages/homePage/HomeScreen";
import { AboutScreen } from "@/pages/aboutPage/AboutScreen";
import { ContactScreen } from "@/pages/contactPage/ContactScreen";
import CreateCourse from "@/pages/courseManagement/views/CreateCourse";
import CreateCode from "@/pages/courseManagement/views/CreateCode";
import ProfileManagement from "@/pages/courseManagement/views/ProfileManagement";

import CoursesListStudents from "@/pages/courseViewer/views/CoursesList";
import CoursePlayer from "@/pages/courseViewer/views/CoursePlayer";
import AccessCode from "@/pages/courseViewer/views/AccessCode";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal Home con subrutas */}
      <Route path="/home">
        {/* Rutas directamente dentro de Home */}
        <Route path="" element={<HomeScreen />} />
        <Route path="about" element={<AboutScreen />} />
        <Route path="contact" element={<ContactScreen />} />

        {/* Subrutas bajo la categoría de "course" */}
        <Route path="courses">
          <Route element={<AdminLayout />}>
            <Route path="coursesList" element={<CoursesListStudents />} />
          </Route>
          <Route path="course/:token" element={<CoursePlayerLayout />}>
            <Route index element={<CoursePlayer />} />
          </Route>
          <Route path="coursesAccess" element={<AccessCode />} />
        </Route>

        <Route path="manageCourses">
          <Route element={<AdminLayout />}>
            <Route
              path="createCourse"
              element={<CreateCourse mode="create" />}
            />
            <Route
              path="editCourse/:id"
              element={<CreateCourse mode="edit" />}
            />
            <Route path="createCode" element={<CreateCode />} />
            <Route path="profile" element={<ProfileManagement />} />
          </Route>
        </Route>
      </Route>
      {/* Redirigir cualquier otra ruta al Home */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default AppRoutes;
