const express = require("express");
const app = express();
const hbs = require("hbs");
const request = require("request");

const AppHash = {
  stable: "EvsSSj4C6vl",
  beta: "xFJnfg75+8v",
  dev: "",
  canary: "PqEvUq15HeK",
  local: "s3LhKBB0M33"
};

app.set("view engine", "html");
app.engine("html", hbs.__express);
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  if (
    req.get("x-forwarded-proto") &&
    req.get("x-forwarded-proto").split(",")[0] !== "https"
  ) {
    return res.redirect(301, `https://${process.env.HOSTNAME}`);
  }
  req.schema = "https";
  next();
});

app.get("/", function(request, response) {
  response.render("index.html", {
    AppHash: AppHash
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
