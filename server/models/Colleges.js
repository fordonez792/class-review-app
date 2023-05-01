module.exports = (sequelize, DataTypes) => {
  // Creates a table with the given columns in database
  const Colleges = sequelize.define("Colleges", {
    collegeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    collegeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collegeEnglishName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Colleges;
};
