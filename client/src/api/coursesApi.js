import axios from "axios";

// Gets all colleges
export const getColleges = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}colleges/get-all`)
    .then((res) => res.data);
};

// Gets all departments
export const getDepartments = (collegeId) => {
  return axios
    .get(
      `${process.env.REACT_APP_URL}departments/get-by-college-id/${collegeId}`
    )
    .then((res) => res.data);
};

// Gets courses with the selected filters, default will be just by departmentId
export const getCourses = (selectedFilters) => {
  const {
    search,
    departmentId,
    taughtInEnglish,
    fall,
    spring,
    courseLevel,
    time,
    sort,
    rating,
  } = selectedFilters;
  return axios
    .get(
      `${
        process.env.REACT_APP_URL
      }courses/filter/?id=${departmentId}&search=${search}&taughtInEnglish=${taughtInEnglish}&fall=${fall}&spring=${spring}&courseLevel=${Array.from(
        courseLevel
      ).join(".")}&time=${Array.from(time).join(
        "."
      )}&sort=${sort}&rating=${rating}`
    )
    .then((res) => res.data);
};

// Gets all courses that start with the query string
export const getCoursesByNameOrId = (query) => {
  return axios
    .get(`${process.env.REACT_APP_URL}courses/find/?query=${query}`)
    .then((res) => res.data);
};

// Updates the visited when a course webpage is visited
export const increaseVisited = (courseId) => {
  axios.put(`${process.env.REACT_APP_URL}courses/increase-visited/${courseId}`);
};

// Returns the top 5 most popular courses
export const getPopularCourses = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}courses/popular`)
    .then((res) => res.data);
};

// Returns a course that matches the id given
export const getCourseById = (courseId) => {
  return axios
    .get(`${process.env.REACT_APP_URL}courses/get-by-id/${courseId}`)
    .then((res) => res.data);
};

// Specific for admins, returns the number of courses with reviews
export const getNumberOfCoursesWithReviews = () => {
  return axios
    .get(`${process.env.REACT_APP_URL}courses/with-reviews`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data);
};
