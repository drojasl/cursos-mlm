import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <section className="layout">
        <header className="header">
          <Navbar />
        </header>
        <main className="main">
          <Outlet />
        </main>
        <div className="contact_info">CONTACT INFO</div>
        <footer className="footer">FOOTER</footer>
      </section>
    </>
  );
};

export default MainLayout;
