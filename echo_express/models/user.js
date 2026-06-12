const { DataTypes } = require("sequelize");

module.exports = (sequelize) => 
    sequelize.define("User", {
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        nickname: { type: DataTypes.STRING, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: false },
    });