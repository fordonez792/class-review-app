export const criteria = [
  { english: "difficulty", chinese: "難度" },
  { english: "engaging", chinese: "互動性" },
  { english: "effectiveness", chinese: "效率" },
  { english: "fair assessments", chinese: "同等對待" },
  { english: "recommend", chinese: "推薦" },
];

export const difficultyDescription = {
  name: "difficulty",
  criteria: [
    "The course is really easy.",
    "The course is slightly easy.",
    "The course is a little challenging, but not over the top.",
    "The course is slightly hard.",
    "The course is way too hard, not enjoyable.",
  ],
  criteriaChinese: [
    "課程非常簡單",
    "課程還算簡單",
    "課程不算太難，但有點挑戰",
    "課程有點難度",
    "課程太過困難",
  ],
  definition:
    "The degree of difficulty or complexity of the content of a course in a specific subject area.",
  definitionChinese: "課程內容的困難或複雜程度",
};

export const engagingDescription = {
  name: "engaging",
  criteria: [
    "The course content or teacher was not interesting or engaging.",
    "The course is not so interesting.",
    "The course is decently engaging.",
    "The course is interesting.",
    "The course was very interesting and engaging.",
  ],
  criteriaChinese: [
    "課程內容或教師令人感到無趣",
    "課程有點無趣",
    "課程還算有趣",
    "課程有趣",
    "課程非常有趣也非常令人感興趣",
  ],
  definition: "The degree to which the course captured the students attention.",
  definitionChinese: "學生對課程感興趣的程度",
};

export const effectivenessDescription = {
  name: "effectiveness",
  criteria: [
    "The course was not effective at all, I did not learn a thing from this course.",
    "The course was not so effective.",
    "The course is fairly effective, I learned some new things.",
    "The course was effective.",
    "The course was highly effective, I gained a lot of new knowledge.",
  ],
  criteriaChinese: [
    "課程毫無意義，我並沒有從中獲得任何知識",
    "課程沒什麼意義",
    "課程還算有意義，有從中獲得一點新知識",
    "課程有意義",
    "課程非常有意義，我從中學習到非常多新知識",
  ],
  definition:
    "The degree to which the course content was learned by the student.",
  definitionChinese: "學生對課程內容的吸收程度",
};

export const fairAssessmentsDescription = {
  name: "fair assessments",
  criteria: [
    "Exams are too difficult, or include content that was not taught in class.",
    "Exams are still really difficult, and require a lot of studying and effort.",
    "Exams are decently challenging",
    "Exams are not bad with enough study time, but the class content itself is challenging.",
    "Exams are not hard if you have previously studied and the exam content was all covered in the course.",
  ],
  criteriaChinese: [
    "試題太過困難或超出課堂範圍",
    "既使花費很多時間和精力準備，試題仍十分困難",
    "試題有點挑戰",
    "若有充足準備，試題不算太難，但課程內容偏困難",
    "充足準備後，試題並不難且出題範圍並未超出課程內容",
  ],
  definition:
    "The degree to which exams in the course are fair to the students taking them in regards to the course content.",
  definitionChinese: "試題難易程度及範圍相關度",
};

export const recommendDescription = {
  name: "recommend",
  criteria: [
    "I do not recommend this course at all.",
    "I do not recommend this course.",
    "This course is not bad but could be better.",
    "I recommend this course.",
    "I highly recommend this course.",
  ],
  criteriaChinese: [
    "我完全不推薦此課",
    "我不推薦此課",
    "我覺得此課不算太差但可以更好",
    "我推薦此課",
    "我十分推薦此課",
  ],
  definition:
    "The degree to which this course can be suggested to other students to take.",
  definitionChinese: "對這堂課的推薦程度",
};
