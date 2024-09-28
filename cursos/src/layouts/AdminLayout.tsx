import { Navbar } from "@/components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const AdminLayout = () => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const formatRouteName = (name: string) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str: string) => str.toUpperCase());
  };

  const routes = pathnames
    .map((value, index) => {
      const isToken = /^[a-zA-Z0-9_-]{20,}$/.test(value);
      if (isToken) {
        return null;
      }

      const link = `/${pathnames.slice(0, index + 1).join("/")}`;
      return { title: formatRouteName(value), link };
    })
    .filter(Boolean); // Remove null values

  return (
    <section className="flex flex-col h-screen bg-[#F6F7F9]">
      <header>
        <Navbar />
      </header>
      <main className="flex flex-col flex-grow p-3">
        <div className="pb-3">
          <Breadcrumbs routes={routes} />
        </div>
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
      </main>
    </section>
  );
};

export default AdminLayout;
