module.exports = (sequelize, DataTypes) => {
  // Creates a table with the given columns in database
  const Courses = sequelize.define("Courses", {
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseEnglishName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requiredCourse: {
      type: DataTypes.STRING,
    },
    taughtInEnglish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    courseYear: {
      type: DataTypes.STRING,
    },
    teacher: {
      type: DataTypes.STRING,
    },
    time: {
      type: DataTypes.STRING,
    },
    fallSemester: {
      type: DataTypes.BOOLEAN,
    },
    springSemester: {
      type: DataTypes.BOOLEAN,
    },
    visited: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    numberOfReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    overallDifficulty: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    overallEngaging: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    overallEffectiveness: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    overallFairAssessments: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    overallRecommend: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });

  Courses.associate = (models) => {
    Courses.belongsTo(models.Departments, {
      foreignKey: "departmentId",
      targetKey: "departmentId",
    });
  };

  return Courses;
};
