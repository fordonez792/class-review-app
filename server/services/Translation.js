const getTranslation = (name, is) => {
  let englishName = "";
  // Translate college name to english
  if (name === "理工學院" && is === "COLLEGE") {
    englishName = "College of Science and Engineering";
  }
  if (name === "管理學院" && is === "COLLEGE") {
    englishName = "College of Management";
  }
  if (name === "人文社會科學學院" && is === "COLLEGE") {
    englishName = "College of Humanities and Social Sciences";
  }
  if (name === "原住民民族學院" && is === "COLLEGE") {
    englishName = "College of Indigenous Studies";
  }
  if (name === "藝術學院" && is === "COLLEGE") {
    englishName = "College of the Arts";
  }
  if (name === "花師教育學院" && is === "COLLEGE") {
    englishName = "Hua-Shih College of Education";
  }
  if (name === "師資培育中心" && is === "COLLEGE") {
    englishName = "Center for Teacher Education";
  }
  if (name === "通識教育中心" && is === "COLLEGE") {
    englishName = "General Education Center";
  }
  if (name === "環境學院" && is === "COLLEGE") {
    englishName = "College of Environmental Studies";
  }
  if (name === "海洋科學學院" && is === "COLLEGE") {
    englishName = "College of Marine Sciences";
  }
  if (name === "環境暨海洋學院" && is === "COLLEGE") {
    englishName = "College of Environmental Studies and Oceanography";
  }
  if (name === "共同教育委員會" && is === "COLLEGE") {
    englishName = "Commission of General Education";
  }
  if (name === "暑期課程先修班" && is === "COLLEGE") {
    englishName = "Summer Pre-course Classes";
  }
  if (name === "洄瀾學院" && is === "COLLEGE") {
    englishName = "College of Huilan";
  }
  // College of Science and Engineering Departments
  // Same
  if (name === "理工學院" && is === "DEPARTMENT") {
    englishName = "College of Science and Engineering Bachelor";
  }
  if (name === "應用數學系") {
    englishName = "Department of Applied Mathematics";
  }
  if (name === "化學系") {
    englishName = "Department of Chemistry";
  }
  if (name === "生命科學系") {
    englishName = "Department of Life Science";
  }
  if (name === "物理學系") {
    englishName = "Department of Physics";
  }
  if (name === "資訊工程學系") {
    englishName = "Department of Computer Science and Information Engineering";
  }
  if (name === "材料科學與工程學系") {
    englishName = "Department of Material Science and Engineering";
  }
  if (name === "電機工程學系") {
    englishName = "Department of Electrical Engineering";
  }
  if (name === "光電工程學系") {
    englishName = "Department of Opto-Electronic Engineering";
  }
  // College of Management
  if (name === "管理學院" && is === "DEPARTMENT") {
    englishName = "College of Management Bachelor";
  }
  if (name === "管理學院高階經營管理碩士在職專班") {
    englishName = "Executive Master Program of Business Administration";
  }
  if (name === "管理學院管理科學與財金國際學士學位學程") {
    englishName = "Bachelor Program of Management Science and Finance";
  }
  if (name === "企業管理學系") {
    englishName = "Department of Business Administration";
  }
  if (name === "國際企業學系") {
    englishName = "Department of Internation Business";
  }
  if (name === "會計學系") {
    englishName = "Department of Accounting";
  }
  if (name === "資訊管理學系") {
    englishName = "Department of Information Management";
  }
  if (name === "財務金融學系") {
    englishName = "Department of Finance";
  }
  if (name === "運籌管理研究所") {
    englishName = "Graduate Institute of Logistics Management";
  }
  if (name === "觀光暨休閒遊憩學系") {
    englishName = "Department of Tourism Recreation and Leisure Studies";
  }
  // College of Humanities and Social Sciences
  if (name === "人文社會科學學院" && is === "DEPARTMENT") {
    englishName = "College of Humanities and Social Sciences Bachelor";
  }
  if (name === "人文社會科學學院華語文教學國際博士班") {
    englishName =
      "International PHD Program in Teaching Chinese as a Second Language";
  }
  if (name === "人文社會科學學院華語文教學暨書法國際碩士班") {
    englishName =
      "International Master Program in Teaching Chinese and Calligraphy";
  }
  if (name === "人文社會科學學院亞太區域研究博士班") {
    englishName = "PHD Program in Asia-Pacific Regional Studies";
  }
  if (name === "華文文學系") {
    englishName = "Department of Sinophone Literatures";
  }
  if (name === "英美語文學系") {
    englishName = "Department of English";
  }
  if (name === "歷史學系") {
    englishName = "Department of History";
  }
  if (name === "諮商與臨床心理學系") {
    englishName = "Department of Counseling and Clinical Psychology";
  }
  if (name === "經濟學系") {
    englishName = "Department of Economics";
  }
  if (name === "中國語文學系") {
    englishName = "Department of Chinese Language and Literature";
  }
  if (name === "臺灣文化學系") {
    englishName = "Department of Taiwan and Regional Studies";
  }
  if (name === "社會學系") {
    englishName = "Department of Sociology";
  }
  if (name === "公共行政學系") {
    englishName = "Department of Public Administration";
  }
  if (name === "法律學系") {
    englishName = "Department of Law";
  }
  if (name === "法律學系原住民專班") {
    englishName = "Department of Law (Indigenous Law Program)";
  }
  // College of Environmental Studies and Oceanography
  if (name === "環境暨海洋學院" && is === "DEPARTMENT") {
    englishName = "College of Environmental Studies and Oceanography Bachelor";
  }
  if (name === "自然資源與環境學系") {
    englishName = "Department of Natural Resources and Environmental Studies";
  }
  if (name === "海洋生物研究所") {
    englishName = "Graduate Institute of Marine Biology";
  }
  if (name === "人文與環境碩士學位學程") {
    englishName = "Master of Humanity and Environmental Science Program";
  }
  // Colleg of the Arts
  if (name === "藝術學院" && is === "DEPARTMENT") {
    englishName = "College of the Arts Bachelor";
  }
  if (name === "藝術創意產業學系") {
    englishName = "Department of Arts and Creative Industries";
  }
  if (name === "音樂學系") {
    englishName = "Department of Music";
  }
  if (name === "藝術與設計學系") {
    englishName = "Department of Arts and Design";
  }
  // Hua-Shih College of Education
  if (name === "花師教育學院" && is === "DEPARTMENT") {
    englishName = "Hua-Shih College of Education Bachelor";
  }
  if (name === "幼兒教育學系") {
    englishName = "Department of Early Childhood Education";
  }
  if (name === "特殊教育學系") {
    englishName = "Department of Special Education";
  }
  if (name === "教育行政與管理學系") {
    englishName = "Department of Educational Administration and Management";
  }
  if (name === "教育與潛能開發學系") {
    englishName = "Department of Education and Human Potentials Developments";
  }
  if (name === "體育與運動科學系") {
    englishName = "Department of Physical Education and Kinesiology";
  }
  // College of Indigenous Studies
  if (name === "原住民民族學院" && is === "DEPARTMENT") {
    englishName = "College of Indigenous Studies Bachelor";
  }
  if (name === "族群關係與文化學系") {
    englishName = "Department of Ethnic Relations and Cultures";
  }
  if (name === "民族語言與傳播學系") {
    englishName = "Department of Indigenous Languages and Communication";
  }
  if (name === "民族事務與發展學系") {
    englishName = "Department of Indigenous Affairs and Development";
  }
  if (name === "民族社會工作學士學位學程") {
    englishName = "Undergraduate Program of Indigenous Social Work";
  }
  if (name === "原住民族樂舞與藝術學士學位學程") {
    englishName = "Undergraduate Program of Indigenous Performance and Arts";
  }
  // College of Huilan
  if (name === "洄瀾學院" && is === "DEPARTMENT") {
    englishName = "College of Huilan Bachelor";
  }
  if (name === "縱谷跨域書院學士學位學程") {
    englishName =
      "Undergraduate Degree Program of Rift Valley Interdisciplinary Academy";
  }
  if (name === "語言中心") {
    englishName = "Language Center";
  }
  if (name === "體育中心") {
    englishName = "Physical Education Center";
  }
  if (name === "華語文中心") {
    englishName = "Chinese Language Center";
  }
  // Center for Teacher Education
  if (name === "小學教育") {
    englishName = "Education Program for Elementary Teacher Education";
  }
  if (name === "中等教育") {
    englishName = "Education Program for Secondary Teacher Education";
  }
  if (name === "卓越儲備教師增能學程") {
    englishName =
      "The Program for Promoting Specialties of Prominent Teacher-To-Be Of NDHU";
  }
  if (name === "雙語教學師資培育課程") {
    englishName = "Course Of Bilingual Teacher Education";
  }
  // General Education Center
  if (name === "通識教育中心" && is === "DEPARTMENT") {
    englishName = "General Education Center Bachelor";
  }
  // Summer Pre-course Classes
  if (name === "暑期先修學士班") {
    englishName = "Summer Bachelor";
  }
  return englishName;
};

module.exports = { getTranslation };
