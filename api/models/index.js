const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../board.db"),
    logging: true,
});

const User = require("./user")(sequelize);
const Post = require("./post")(sequelize);

// User 1 <-> N Post
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

// Post 1 <- Post
Post.belongsTo(Post, { foreignKey: "rootPostId", as: "rootPost" });

// Post 1 <-> N Post
Post.belongsTo(Post, { foreignKey: "parentPostId", as: "parentPost" });
Post.hasMany(Post, { foreignKey: "parentPostId", as: "children" });

module.exports = { sequelize, User, Post };