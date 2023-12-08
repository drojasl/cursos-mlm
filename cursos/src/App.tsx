import { Route, Routes, Navigate } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { HomeScreen } from "./routes/HomeScreen"
import { AboutScreen } from "./routes/AboutScreen"
import { ContactScreen } from "./routes/ContactScreen"

const App = () => {
  return (
    <>
      <section className="layout">
        <header className="header">
          <Navbar />
        </header>
        <main className="main">
          <Routes>
            <Route path='/cursos' element={ <HomeScreen /> } />
            <Route path='/about' element={ <AboutScreen /> } />
            <Route path='/contact' element={ <ContactScreen /> } />
            <Route path='/*' element={ <Navigate to='/' /> } />
          </Routes>
        </main>
        <div className="contact_info">CONTACT INFO</div>
        <footer className="footer">FOOTER</footer>
      </section>
    </>
  )
}

export default App
