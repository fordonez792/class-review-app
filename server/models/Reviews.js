module.exports = (sequelize, DataTypes) => {
  // Creates a table with the given columns in database
  const Reviews = sequelize.define(
    "Reviews",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      engaging: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      effectiveness: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fairAssessments: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recommend: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numberOfHelpfulVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      numberOfReportVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    }
  );

  // Connects table to users, courses, helpfulvotes, and reportvotes tables
  Reviews.associate = (models) => {
    Reviews.belongsTo(models.Users, {
      foreignKey: "creator",
    });
    Reviews.belongsTo(models.Courses, {
      foreignKey: "courseId",
    });
    Reviews.hasMany(models.HelpfulVotes, {
      onDelete: "cascade",
    });
    Reviews.hasMany(models.ReportVotes, {
      onDelete: "cascade",
    });
  };

  return Reviews;
};
