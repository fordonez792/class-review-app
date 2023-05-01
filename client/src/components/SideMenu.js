import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTimes, FaAngleRight } from "react-icons/fa";

import SecondLevelSideMenu from "./SecondLevelSideMenu";

import { getColleges } from "../api/coursesApi";
import { sideMenuTranslations } from "../assets/componentsTranslations";
import { useLanguageContext } from "../context/LanguageContext";

const SideMenu = ({ isOpen, setIsOpen }) => {
  const { language } = useLanguageContext();

  // State to control the second level sidemenu
  const [openSecondLevel, setOpenSecondLevel] = useState(false);
  // State to hold the college that has been clicked on
  const [selectedCollege, setSelectedCollege] = useState({ id: 0, name: "" });

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1199);

  // Fetch colleges with function defined in coursesApi file
  const {
    status,
    error,
    data: colleges,
  } = useQuery(["colleges"], () => getColleges());

  const updateState = async () => {
    setIsDesktop(window.innerWidth > 1199);
    setIsOpen(false);
    setOpenSecondLevel(false);
  };

  useEffect(() => {
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  });

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
