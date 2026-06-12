// npm install 
// express bcryptjs multer dotenv jsonwebtoken nodemon sequelize joi sqlite3

const post = 3001;

const express = require("express");
const { sequelize, User } = require("./models");
const userRoute = require("./routes/userRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoute);

async function main() {
    await sequelize.sync();
    app.listen(post, () => console.log(`Server start to http://localhost:${post}`));
}

main();