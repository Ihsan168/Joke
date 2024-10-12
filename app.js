const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/get-joke", async (req, res) => {
  const name = req.body.name;
  try {
    const response = await axios.get("https://v2.jokeapi.dev/joke/Any");
    const joke = response.data;

    let jokeText;
    if (joke.type === "single") {
      jokeText = joke.joke;
    } else {
      jokeText = `${joke.setup} - ${joke.delivery}`;
    }

    const personalizedJoke = jokeText.replace(/you|your/gi, name);

    res.render("result", { joke: personalizedJoke });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Joke retrieval failed. Please give it another go later.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
