const express = require("express");
const app = express();
const port = 4000;
const expressHbs = require("express-handlebars");
const {createPagination} = require("express-handlebars-paginate");

app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialDir: __dirname + "/views/partials",
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      showDate: (date) => {
        return date.toLocaleDateString("en-Us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      createPagination,
    },
  })
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/index.html", (req, res) => {
  res.redirect("/blogs");
});

app.use(express.static(__dirname + "/html"));

app.use("/blogs", require("./routes/blogRouter"));

app.get("/createTables", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("Table created!");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
