import { Outlet } from "react-router-dom";

const CoursePlayerLayout = () => {
  return (
    <section className="flex flex-col h-screen">
      <main className="flex flex-col flex-grow">
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </section>
  );
};

export default CoursePlayerLayout;
