const { DataTypes } = require("sequelize");

module.exports = (sequelize) => 
    sequelize.define("Post", {
        content: { type: DataTypes.STRING, allowNull: false },
    });