module.exports = (sequelize, DataTypes) => {
  // Creates a table with the given columns in database
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
    },
    photoUrl: {
      type: DataTypes.STRING,
    },
    googleSignIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    numberOfReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    numberOfHelpfulVotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  });

  // Connects this table to the helpfulvotes and reportvotes tables
  Users.associate = (models) => {
    Users.hasMany(models.HelpfulVotes, {
      onDelete: "cascade",
    });
    Users.hasMany(models.ReportVotes, {
      onDelete: "cascade",
    });
  };

  return Users;
};
