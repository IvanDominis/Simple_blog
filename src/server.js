const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const configViewEngine = require("./config/viewEngine.config");
const authRoutes = require("./routes/auth.Route");
const adminRoutes = require("./routes/admin.Route");
const userRoutes = require("./routes/user.Route");
const mainRoutes = require("./routes/main.Route");
const postRoutes = require("./routes/post.Route");
const blogRoutes = require("./routes/blog.Route");
const session = require("express-session");
const { checkUser } = require("./middleware/auth.Middleware");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME;
const url = process.env.MONGODB_URL;
const secret_key = process.env.SESSION_SECRET;
configViewEngine(app);

mongoose.connect(url).then(() => {
  console.log("Connected to MongoDB");
});
// app.use(session({
//     secret: secret_key,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 600000 }  // Session expires after 1 minute for demonstration
// }));
// app.use((req, res, next) => {
//     res.locals.user = req.session.user;
//     next();
// });
// config request body parser
app.use(cors()); // Check that the request is coming from the same origin
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
app.use(express.json());
app.use(bodyParser.json());

// route
app.get('*', checkUser);
app.use('/', mainRoutes);
app.use('/admin', adminRoutes);
app.use('/compose', postRoutes);
app.use('/yourBlogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
