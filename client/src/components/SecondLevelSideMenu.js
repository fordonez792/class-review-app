import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, createSearchParams } from "react-router-dom";
import { FaTimes, FaAngleRight, FaAngleLeft } from "react-icons/fa";

import { useLanguageContext } from "../context/LanguageContext";
import { getDepartments } from "../api/coursesApi";

// The second level of the sidemenu specifically for departments within the college that was chosen on the first sidemenu
// Displays all departments of that college, and on click redirects to the search results page displaying all courses for that department

const SecondLevelSideMenu = ({
  selectedCollege,
  isOpen,
  setIsOpen,
  openSecondLevel,
  setOpenSecondLevel,
}) => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();

  // State to hold the department that has been clicked on
  const [selectedDepartment, setSelectedDepartment] = useState({
    id: 0,
    name: "",
  });

  // Fetch departments with function defined in coursesApi file
  const {
    status,
    error,
    data: departments,
  } = useQuery(["departments", `${selectedCollege.id}`], () =>
    getDepartments(selectedCollege.id)
  );

  // After a department has been selected, navigate to the search results page
  useEffect(() => {
    if (selectedDepartment.id === 0 || selectedDepartment.name === "") return;
    navigate({
      pathname: "/search/",
      // Search parameters for the courses
      search: createSearchParams({
        collegeId: selectedCollege.id,
        department: selectedDepartment.name,
        departmentId: selectedDepartment.id,
      }).toString(),
    });
    setIsOpen(false);
    setOpenSecondLevel(false);
  }, [selectedDepartment, setSelectedDepartment]);

  return (
    <section
      id="side-menu"
      className={`side-menu2 ${
        (isOpen ? "active" : null, openSecondLevel ? "open" : null)
      } ${language === "Chinese" ? "chinese" : null}`}
    >
      <div className="container">
        <div className="go-back">
          <FaAngleLeft onClick={() => setOpenSecondLevel(false)} />
        </div>
        <div className="close-btn">
          <FaTimes
            onClick={() => {
              setIsOpen(false);
              setOpenSecondLevel(false);
            }}
          />
        </div>
        <article className="header">
          <h1>{selectedCollege.name}</h1>
        </article>
        <ul
          className="options"
          onClick={(e) => {
            setSelectedDepartment({
              id: e.target.id,
              name: e.target.children[0].textContent,
            });
          }}
        >
          {status === "success" &&
            departments?.map((department, index) => {
              const { departmentId, departmentEnglishName, departmentName } =
                department;
              return (
                <li
                  key={index}
                  id={departmentId}
                  value={
                    language === "English"
                      ? departmentEnglishName
                      : language === "Chinese" && departmentName
                  }
                >
                  <span>
                    {language === "English"
                      ? departmentEnglishName
                      : language === "Chinese" && departmentName}
                  </span>
                  <FaAngleRight />
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
};

export default SecondLevelSideMenu;
