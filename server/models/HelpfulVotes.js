module.exports = (sequelize, DataTypes) => {
  // Creates a table with the given columns in database
  const HelpfulVotes = sequelize.define("HelpfulVotes");

  return HelpfulVotes;
};
