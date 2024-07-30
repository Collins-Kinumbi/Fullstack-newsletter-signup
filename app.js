const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

//dynamic port
const port = process.env.PORT;

const key = "339d2454a60ec58ff93b99f231594a83-us14";

const listID = "a6d84de7ba";

app.use(bodyParser.urlencoded({ extended: true }));

// to get static files like css and images
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  // console.log(req.body);
  const { firstName, lastName, email } = req.body;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us14.api.mailchimp.com/3.0/lists/${listID}`;

  const options = {
    method: "POST",
    auth: `collins:${key}`,
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });

    if (response.statusCode === 200) {
      // res.send("Successfully subscribed!");
      res.sendFile(__dirname + "/success.html");
    } else {
      // res.send("There was an error with signing up, please try again!");
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();
});

// back to signup page if subscription failed
app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port || 3000, () => {
  console.log("Server running on port: " + port);
});
