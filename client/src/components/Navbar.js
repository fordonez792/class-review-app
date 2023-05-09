import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FaBars,
  FaUserAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaEdit,
  FaUserCog,
  FaSearch,
  FaTimes,
  FaComment,
  FaPen,
} from "react-icons/fa";

import SideMenu from "./SideMenu";
import Search from "./Search";
import logo from "../assets/logo.png";

import { navbarTranslations } from "../assets/componentsTranslations";
import { useLanguageContext } from "../context/LanguageContext";
import { useSearchContext } from "../context/SearchContext";
import { useAuthStateContext } from "../context/AuthStateContext";
import { useScreenSizeContext } from "../context/ScreenSizeContext";

// Navbar that allows for users to navigate website easily
// If logged in, user can access their account, write a review page, chatbot, search through courses with a searchbar and search courses by choosing a college and department, as well as logout
// If not logged in, users can still access the chatbot, login and signup page, and search a course with both typing in searchbar, or choosing college and department

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { language } = useLanguageContext();
  const { authState, logOut } = useAuthStateContext();
  const { isSearchOpen, setIsSearchOpen } = useSearchContext();
  const { isTablet, isDesktop } = useScreenSizeContext();

  const [isOpen, setIsOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");

  const accountMenuRef = useRef();
  const searchbarRef = useRef();

  // Opens menu if screen is mobile or tablet
  const openAccountMenu = () => {
    if (!accountMenuRef.current) return;
    if (!accountMenuRef.current?.classList?.contains("active")) {
      accountMenuRef.current?.classList?.add("active");
    } else {
      accountMenuRef.current?.classList?.remove("active");
    }
  };

  // Closes menu if screen is mobile or tablet
  const closeAccountMenu = (e) => {
    console.log(e.target);
    if (!e.target) return;
    if (
      e.target?.classList?.contains("account-option") ||
      e.target?.classList?.contains("account-menu") ||
      e.target?.classList?.contains("account-btn")
    )
      return;
    else {
      accountMenuRef.current?.classList?.remove("active");
    }
  };

  // Searchbar appears after user scrolls past home page searchbar if screen is desktop
  const activateSearchbar = () => {
    if (!searchbarRef.current) return;
    if (window.scrollY > 350) searchbarRef.current?.classList?.add("active");
    else searchbarRef.current?.classList?.remove("active");
  };

  // Goes to home page and closes the search page
  const navigateHome = () => {
    setIsSearchOpen(false);
    navigate("/");
  };

  // Closes the search page if it is open and opens the colleges menu / side menu
  const openSideMenu = () => {
    setIsSearchOpen(false);
    setIsOpen(true);
  };

  // Activates both the close menu when clicking anywhere but the menu on both tablet and mobile and the searchbar function on desktop
  useEffect(() => {
    !isDesktop && document.addEventListener("click", closeAccountMenu);
    if (!searchbarRef.current) return;
    location.pathname === "/" &&
      searchbarRef.current &&
      document.addEventListener("scroll", activateSearchbar);

    return () => {
      !isDesktop && document.removeEventListener("click", closeAccountMenu);
      if (!searchbarRef.current) return;
      location.pathname === "/" &&
        searchbarRef.current &&
        document.removeEventListener("scroll", activateSearchbar);
    };
  }, [location.pathname]);

  // Adds the searchbar automatically on the screen if it is not write-review page or home page
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/write-review")
      return;
    if (!searchbarRef.current) return;
    searchbarRef.current?.classList?.add("active");
  }, []);

  // Applies focus to the searchbar if we click on the home page searchbar
  useEffect(() => {
    if (!searchbarRef.current) return;
    if (!isSearchOpen) searchbarRef.current.children[1].blur();
    if (isSearchOpen) searchbarRef.current.children[1].focus();
  }, [isSearchOpen]);

  return (
    <>
      <section id="navbar">
        <div className="container">
          {isTablet ? (
            <nav className="navbar">
              <div className="left">
                {isDesktop ? (
                  <article className="logo" onClick={() => navigateHome()}>
                    <img src={logo} alt="Logo" />
                  </article>
                ) : (
                  <article className="side-menu">
                    <FaBars
                      onClick={() => {
                        openSideMenu();
                      }}
                    />
                  </article>
                )}
                {isDesktop ? (
                  <article
                    className="side-menu"
                    onClick={() => openSideMenu()}
                    onMouseEnter={() => openSideMenu()}
                  >
                    <h1>
                      {language === "English"
                        ? navbarTranslations[8].english
                        : language === "Chinese" &&
                          navbarTranslations[8].chinese}
                    </h1>
                  </article>
                ) : (
                  <article className="logo" onClick={() => navigateHome()}>
                    <img src={logo} alt="Logo" />
                  </article>
                )}
              </div>
              {isDesktop && (
                <div className="center">
                  <form className="searchbar" ref={searchbarRef}>
                    <label>
                      <FaSearch />
                    </label>
                    <input
                      name="search"
                      type="text"
                      placeholder={
                        language === "English"
                          ? navbarTranslations[7].english
                          : language === "Chinese" &&
                            navbarTranslations[7].chinese
                      }
                      autoComplete="off"
                      value={navSearch}
                      onChange={(e) => setNavSearch(e.target.value)}
                      onClick={() => {
                        setIsSearchOpen(true);
                        setIsOpen(false);
                      }}
                    />
                    {navSearch && (
                      <FaTimes
                        className="clear"
                        onClick={() => setNavSearch("")}
                      />
                    )}
                  </form>
                </div>
              )}
              <ul className="right">
                {authState?.loggedIn && localStorage.getItem("accessToken") ? (
                  <>
                    {!isDesktop && (
                      <li
                        className={`account-option ${
                          isSearchOpen ? "close-btn" : null
                        }`}
                        onClick={() => {
                          setIsSearchOpen(!isSearchOpen);
                        }}
                        title="Search"
                      >
                        {isSearchOpen ? <FaTimes /> : <FaSearch />}
                      </li>
                    )}
                    <li
                      className="account-option"
                      onClick={() => {
                        navigate("/account");
                      }}
                      title={
                        language === "English"
                          ? navbarTranslations[0].english
                          : language === "Chinese" &&
                            navbarTranslations[0].chinese
                      }
                    >
                      <FaUserAlt />{" "}
                      {isDesktop && (
                        <span>
                          {language === "English"
                            ? navbarTranslations[0].english
                            : language === "Chinese" &&
                              navbarTranslations[0].chinese}
                        </span>
                      )}
                    </li>
                    <li
                      className="account-option"
                      onClick={() => {
                        navigate("/write-review");
                      }}
                      title={
                        language === "English"
                          ? navbarTranslations[1].english
                          : language === "Chinese" &&
                            navbarTranslations[1].chinese
                      }
                    >
                      <FaPen />{" "}
                      {isDesktop && (
                        <span>
                          {language === "English"
                            ? navbarTranslations[6].english
                            : language === "Chinese" &&
                              navbarTranslations[6].chinese}
                        </span>
                      )}
                    </li>
                    {!isDesktop && (
                      <li
                        className="account-option"
                        onClick={() => {
                          navigate("/chatbot");
                        }}
                        title="Chatbot"
                      >
                        <FaComment />
                      </li>
                    )}
                    <li
                      className="account-option"
                      onClick={logOut}
                      title={
                        language === "English"
                          ? navbarTranslations[3].english
                          : language === "Chinese" &&
                            navbarTranslations[3].chinese
                      }
                    >
                      <FaSignOutAlt />{" "}
                      {isDesktop && (
                        <span>
                          {language === "English"
                            ? navbarTranslations[3].english
                            : language === "Chinese" &&
                              navbarTranslations[3].chinese}
                        </span>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    {!isDesktop && (
                      <li
                        className={`account-option ${
                          isSearchOpen ? "close-btn" : null
                        }`}
                        onClick={() => {
                          setIsSearchOpen(!isSearchOpen);
                        }}
                        title="Search"
                      >
                        {isSearchOpen ? <FaTimes /> : <FaSearch />}
                      </li>
                    )}
                    {!isDesktop && (
                      <li
                        className="account-option"
                        onClick={() => {
                          navigate("/chatbot");
                        }}
                        title="Chatbot"
                      >
                        <FaComment />
                      </li>
                    )}
                    <li
                      className="account-option"
                      onClick={() => navigate("/login")}
                      title="Login"
                    >
                      <FaSignInAlt />{" "}
                      {isDesktop && (
                        <span>
                          {language === "English"
                            ? navbarTranslations[4].english
                            : language === "Chinese" &&
                              navbarTranslations[4].chinese}
                        </span>
                      )}
                    </li>
                    <li
                      className="account-option"
                      onClick={() => navigate("/signup")}
                      title="Signup"
                    >
                      <FaEdit />{" "}
                      {isDesktop && (
                        <span>
                          {language === "English"
                            ? navbarTranslations[5].english
                            : language === "Chinese" &&
                              navbarTranslations[5].chinese}
                        </span>
                      )}
                    </li>
                  </>
                )}
              </ul>
            </nav>
          ) : (
            <nav className="navbar">
              <article className="side-menu">
                <FaBars onClick={() => openSideMenu()} />
              </article>
              <article className="logo" onClick={() => navigateHome()}>
                <img src={logo} alt="Logo" />
              </article>
              <article className="btn-container">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={isSearchOpen ? "close-btn" : null}
                >
                  {isSearchOpen ? <FaTimes /> : <FaSearch />}
                </button>
                <button
                  className="account-btn"
                  onClick={() => openAccountMenu()}
                >
                  <FaUserAlt />
                </button>
              </article>
              <ul className="account-menu" ref={accountMenuRef}>
                {authState?.loggedIn && localStorage.getItem("accessToken") ? (
                  <>
                    <li
                      className="account-option"
                      onClick={() => {
                        navigate("/account");
                        accountMenuRef.current.classList.remove("active");
                      }}
                    >
                      <span>
                        <FaUserCog />
                      </span>
                      {language === "English"
                        ? navbarTranslations[0].english
                        : language === "Chinese" &&
                          navbarTranslations[0].chinese}
                    </li>
                    <li
                      className="account-option"
                      onClick={() => {
                        navigate("/write-review");
                        accountMenuRef.current.classList.remove("active");
                      }}
                    >
                      <span>
                        <FaPen />
                      </span>
                      {language === "English"
                        ? navbarTranslations[1].english
                        : language === "Chinese" &&
                          navbarTranslations[1].chinese}
                    </li>
                    <li
                      className="account-option"
                      onClick={() => {
                        navigate("/chatbot");
                        accountMenuRef.current.classList.remove("active");
                      }}
                    >
                      <span>
                        <FaComment />
                      </span>
                      {language === "English"
                        ? navbarTranslations[2].english
                        : language === "Chinese" &&
                          navbarTranslations[2].chinese}
                    </li>
                    <li className="account-option" onClick={logOut}>
                      <span>
                        <FaSignOutAlt />
                      </span>
                      {language === "English"
                        ? navbarTranslations[3].english
                        : language === "Chinese" &&
                          navbarTranslations[3].chinese}
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className="account-option"
                      onClick={() => {
                        navigate("/chatbot");
                        accountMenuRef.current.classList.remove("active");
                      }}
                    >
                      <span>
                        <FaComment />
                      </span>
                      {language === "English"
                        ? navbarTranslations[2].english
                        : language === "Chinese" &&
                          navbarTranslations[2].chinese}
                    </li>
                    <li
                      className="account-option"
                      onClick={() => navigate("/login")}
                    >
                      <span>
                        <FaSignInAlt />
                      </span>
                      {language === "English"
                        ? navbarTranslations[4].english
                        : language === "Chinese" &&
                          navbarTranslations[4].chinese}
                    </li>
                    <li
                      className="account-option"
                      onClick={() => navigate("/signup")}
                    >
                      <span>
                        <FaEdit />
                      </span>
                      {language === "English"
                        ? navbarTranslations[5].english
                        : language === "Chinese" &&
                          navbarTranslations[5].chinese}
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}
        </div>
      </section>
      <Outlet />
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <Search
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        navSearch={navSearch}
      />
    </>
  );
};

export default Navbar;
