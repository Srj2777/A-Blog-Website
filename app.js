// jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

mongoose.set("strictQuery", false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Method to connect to mongodb data base
main().catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/blogsiteDB");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const port = process.env.PORT || 3000;

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    }
    // if (err) {
    //   console.log(err);
    // } else {
    //   res.render("home", {
    //     startingContent: homeStartingContent,
    //     posts: posts,
    //   });
    // }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// app.get("/posts/:postid", function (req, res) {
//   // const requestedPostId = _.lowerCase(req.params.postId);

//   // Post.findById(requestedPostId, function (err, post) {
//   //   if (err) {
//   //     console.log(err);
//   //   } else if (post != null) {
//   //     const postTitle = post.title;
//   //     const postBody = post.body;
//   //     res.render("post", { title: postTitle, content: postBody });
//   //   } else console.log("Post doesn't exists");
//   // });

//   const postid = req.params.postid;

//   Post.findById(postid, function (err, foundPost) {
//     if (err) {
//       console.log(err);
//     } else if (foundPost != null) {
//       res.render("post", { title: foundPost.title, content: foundPost.body });
//     } else console.log("Post doesn't exists");
//   });
// });

//posts page route
app.get("/posts/:postid", function (req, res) {
  const postId = req.params.postid;

  Post.findOne({ _id: postId }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else if (foundPost != null) {
      const postTitle = foundPost.title;
      const postBody = foundPost.body;
      res.render("post", { title: postTitle, content: postBody });
    } else console.log("Post doesn't exists");
  });
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});
