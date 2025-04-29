import { useState, useEffect } from "react";
import { NavLink, Link, useParams, useNavigate } from "react-router-dom";
import { ReactComponent as IconReceiptCutoff } from "bootstrap-icons/icons/receipt-cutoff.svg";
import { ReactComponent as IconSunFill } from "bootstrap-icons/icons/sun-fill.svg";
import { ReactComponent as IconMoonStarsFill } from "bootstrap-icons/icons/moon-stars-fill.svg";
import { ReactComponent as IconCircleHalf } from "bootstrap-icons/icons/circle-half.svg";
export function withRouter(Children) {
  return (props) => {
    const match = { params: useParams() };
    return <Children {...props} match={match} />;
  };
}
const Navbar = () => {
  const [navLinks] = useState([
    {
      navigation: "/",
      name: "Home",
    },
    {
      navigation: "/invoices",
      name: "Invoices",
    },
    {
      navigation: "/settings",
      name: "Settings",
    },
    // {
    //   navigation: "/logout",
    //   name: "logout",
    // },
  ]);
  const navigate=useNavigate()
const handlelogout=()=>{
  document.cookie = `auth=${false};`;
  navigate("/login")
}
  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getPreferredTheme());

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (
      theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  }, [theme]);

  return (
    <nav className="navbar navbar-expand-lg shadow">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <IconReceiptCutoff className="me-2" />
         <span >Milon Motors Invoice</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {navLinks.map((item) => (
              <li key={item.name} className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "inactive nav-link"
                  }
                  to={item.navigation}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <hr className="d-lg-none text-white-50"></hr>
          <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
            <li className="nav-item dropdown">
              <button
                className="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center"
                id="bd-theme"
                type="button"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-label="theme"
              >
                {theme === "light" && (
                  <IconSunFill className="my-1 theme-icon-active" />
                )}
                {theme === "dark" && (
                  <IconMoonStarsFill className="my-1 theme-icon-active" />
                )}
                {theme === "auto" && (
                  <IconCircleHalf className="my-1 theme-icon-active" />
                )}

                <span className="d-lg-none ms-2">Theme</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li onClick={() => setTheme("light")}>
                  <button
                    type="button"
                    className={`dropdown-item d-flex align-items-center ${
                      theme === "light" ? "active" : ""
                    }`}
                  >
                    <IconSunFill className="me-2 opacity-50" />
                    Light
                  </button>
                </li>
                <li onClick={() => setTheme("dark")}>
                  <button
                    type="button"
                    className={`dropdown-item d-flex align-items-center ${
                      theme === "dark" ? "active" : ""
                    }`}
                    data-bs-theme-value="dark"
                  >
                    <IconMoonStarsFill className="me-2 opacity-50" />
                    Dark
                  </button>
                </li>
                <li onClick={() => setTheme("auto")}>
                  <button
                    type="button"
                    className={`dropdown-item d-flex align-items-center ${
                      theme === "auto" ? "active" : ""
                    }`}
                  >
                    <IconCircleHalf className="me-2 opacity-50" />
                    Auto
                  </button>
                </li>
                
              </ul>
            </li>
          </ul>
          <button onClick={handlelogout} type="button" class="btn btn-link">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
