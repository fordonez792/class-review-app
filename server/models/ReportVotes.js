module.exports = (sequelize, DataTypes) => {
  // Creates a table with the given columns in database
  const ReportVotes = sequelize.define("ReportVotes");

  return ReportVotes;
};
