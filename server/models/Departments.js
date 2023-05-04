module.exports = (sequelize, DataTypes) => {
  // Creates a table with the given columns in database
  const Departments = sequelize.define("Departments", {
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentEnglishName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Connects this table to the colleges table
  Departments.associate = (models) => {
    Departments.belongsTo(models.Colleges, {
      foreignKey: "collegeId",
      targetKey: "collegeId",
    });
  };

  return Departments;
};
