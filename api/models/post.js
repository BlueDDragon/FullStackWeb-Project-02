const { DataTypes } = require("sequelize");

module.exports = (sequelize) => 
    sequelize.define("Post", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        userId: { type: DataTypes.STRING, allowNull: false },
        rootPostId: { type: DataTypes.INTEGER, allowNull: true },
        parentPostId: { type: DataTypes.INTEGER, allowNull: true },

        content: { type: DataTypes.TEXT, allowNull: false },
        state: { type: DataTypes.ENUM("PUBLIC", "PRIVATE", "NOTICE", "DELETED", "ERROR"), defaultValue: "PUBLIC", allowNull: false },
    },
    {
        timestamps: true,
    });