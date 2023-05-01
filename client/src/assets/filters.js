export const searchFilters = [
  {
    id: 1,
    name: "Language",
    nameChinese: "語言",
    options: [
      { display: "Taught in English", displayChinese: "英語授課", value: true },
    ],
  },
  {
    id: 2,
    name: "Semester",
    nameChinese: "學期",
    options: [
      { display: "Fall", displayChinese: "秋季學期", value: true },
      { display: "Spring", displayChinese: "春季學期", value: true },
    ],
  },
  {
    id: 3,
    name: "Course Level",
    nameChinese: "系級",
    options: [
      { display: "Freshman", displayChinese: "新生", value: "學一" },
      { display: "Sophomore", displayChinese: "二年級", value: "學二" },
      { display: "Junior", displayChinese: "初級", value: "學三" },
      { display: "Senior", displayChinese: "高級", value: "學四" },
      { display: "Postgraduate", displayChinese: "碩專", value: "碩專" },
      { display: "Master", displayChinese: "碩士", value: "碩士" },
      { display: "PhD", displayChinese: "博士", value: "博士" },
      { display: "School Core", displayChinese: "校核心", value: "校核心" },
    ],
  },
  {
    id: 4,
    name: "Course Time",
    nameChinese: "課程時間",
    options: [
      { display: "Monday", displayChinese: "星期一", value: "一" },
      { display: "Tuesday", displayChinese: "星期二", value: "二" },
      { display: "Wednesday", displayChinese: "星期三", value: "三" },
      { display: "Thursday", displayChinese: "星期四", value: "四" },
      { display: "Friday", displayChinese: "星期五", value: "五" },
      { display: "Saturday", displayChinese: "星期六", value: "六" },
      { display: "Sunday", displayChinese: "星期日", value: "日" },
    ],
  },
];

export const reviewFilters = [
  {
    id: 1,
    name: "Rating",
    nameChinese: "評分",
    options: [
      { display: "5", displayChinese: "5", value: "5" },
      { display: "4", displayChinese: "4", value: "4" },
      { display: "3", displayChinese: "3", value: "3" },
      { display: "2", displayChinese: "2", value: "2" },
      { display: "1", displayChinese: "1", value: "1" },
    ],
  },
  {
    id: 2,
    name: "Year",
    nameChinese: "年",
    options: [
      { display: "111", displayChinese: "111", value: "111" },
      { display: "110", displayChinese: "110", value: "110" },
      { display: "109", displayChinese: "109", value: "109" },
      { display: "108", displayChinese: "108", value: "108" },
    ],
  },
  {
    id: 3,
    name: "Semester",
    nameChinese: "學期",
    options: [
      { display: "Fall", displayChinese: "秋季學期", value: true },
      { display: "Spring", displayChinese: "春季學期", value: true },
    ],
  },
];

export const chatbotRatings = [
  "overallMostDifficult",
  "overallEngaging",
  "overallEffectiveness",
  "overallFairAssessments",
  "overallRecommend",
  "overallLeastDifficult",
  "visited",
];

export const chatbotTime = ["一", "二", "三", "四", "五", "六", "日"];

export const chatbotCourseLevel = [
  "學一",
  "學二",
  "學三",
  "學四",
  "碩專",
  "碩士",
  "博士",
  "校核心",
];
