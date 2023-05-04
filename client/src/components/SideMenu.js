import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTimes, FaAngleRight } from "react-icons/fa";

import SecondLevelSideMenu from "./SecondLevelSideMenu";

import { getColleges } from "../api/coursesApi";
import { sideMenuTranslations } from "../assets/componentsTranslations";
import { useLanguageContext } from "../context/LanguageContext";
import { useScreenSizeContext } from "../context/ScreenSizeContext";

// First level of the sidemenu, displays all colleges of NDHU and on click of one will redirect to the second level sidemenu

const SideMenu = ({ isOpen, setIsOpen }) => {
  const { language } = useLanguageContext();
  const { isDesktop } = useScreenSizeContext();

  // State to control the second level sidemenu
  const [openSecondLevel, setOpenSecondLevel] = useState(false);
  // State to hold the college that has been clicked on
  const [selectedCollege, setSelectedCollege] = useState({ id: 0, name: "" });

  // Fetch colleges with function defined in coursesApi file
  const {
    status,
    error,
    data: colleges,
  } = useQuery(["colleges"], () => getColleges());

  // Closes the second level sidemenu if the first level is closed
  useEffect(() => {
    if (!isOpen) setOpenSecondLevel(false);
  }, [isOpen]);

  return (
    <>
      <section id="side-menu" className={isOpen ? "active" : null}>
        {isDesktop && (
          <div
            className="overlay"
            onClick={() => {
              setOpenSecondLevel(false);
              setIsOpen(false);
            }}
            onMouseEnter={() => {
              setOpenSecondLevel(false);
              setIsOpen(false);
            }}
          ></div>
        )}
        <div className="container">
          <div className="close-btn">
            <FaTimes onClick={() => setIsOpen(false)} />
          </div>
          <article className="header">
            <h1>
              {language === "English"
                ? sideMenuTranslations[0].english
                : language === "Chinese" && sideMenuTranslations[0].chinese}
            </h1>
          </article>
          <ul
            className="options"
            onClick={(e) => {
              setSelectedCollege({
                id: e.target.id,
                name: e.target.children[0].textContent,
              });
              setOpenSecondLevel(true);
            }}
            onMouseEnter={(e) => {
              if (!isDesktop) return;
              setSelectedCollege({
                id: e.target.id,
                name: e.target.children[0].textContent,
              });
              setOpenSecondLevel(true);
            }}
            onMouseMove={(e) => {
              if (!isDesktop) return;
              setSelectedCollege({
                id: e.target.id,
                name: e.target.children[0].textContent,
              });
              setOpenSecondLevel(true);
            }}
          >
            {status === "success" &&
              colleges?.map((college, index) => {
                const { collegeId, collegeEnglishName, collegeName } = college;
                return (
                  <li
                    key={index}
                    id={collegeId}
                    value={
                      language === "English"
                        ? collegeEnglishName
                        : language === "Chinese" && collegeName
                    }
                  >
                    <span>
                      {language === "English"
                        ? collegeEnglishName
                        : language === "Chinese" && collegeName}
                    </span>
                    <FaAngleRight />
                  </li>
                );
              })}
          </ul>
        </div>
      </section>
      <SecondLevelSideMenu
        selectedCollege={selectedCollege}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        openSecondLevel={openSecondLevel}
        setOpenSecondLevel={setOpenSecondLevel}
      />
    </>
  );
};

export default SideMenu;
