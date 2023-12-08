import { Link, NavLink } from "react-router-dom"

export const Navbar = () => {
  return (
    <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" href="#">Navbar</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <NavLink to='/cursos' className="nav-link" aria-current="page">Home</NavLink>
                    <NavLink to='/about' className="nav-link">About</NavLink>
                    <NavLink to='/contact' className="nav-link">Contact</NavLink>
                    <NavLink to='/' className="nav-link disabled">Disabled</NavLink>
                </div>
                </div>
            </div>
        </nav>
    </>
  )
}
