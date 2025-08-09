const Url = require("../models/Url");
const shortid = require("shortid");
const validUrl = require("valid-url");

const BASE_URL = process.env.BASE_URL;

exports.createShortUrl = async (req, res) => {
  const { original_url } = req.body;
  const username = req.username;

  if (!original_url) {
    return res.status(400).json({ error: "original_url is required" });
  }
  if (!validUrl.isWebUri(original_url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    let url = await Url.findOne({ original_url, username });
    if (!url) {
      let short_code;
      let exists;
      do {
        short_code = shortid.generate();
        exists = await Url.findOne({ short_code });
      } while (exists);

      url = new Url({ original_url, short_code, username });
      await url.save();
    }

    const shortenedWithFullUrl = {
      ...url.toObject(),
      full_short_url: `${BASE_URL}/${url.short_code}`,
    };

    const userUrls = await Url.find({ username }).sort({ created_at: -1 });
    const historyWithUrls = userUrls.map((u) => ({
      ...u.toObject(),
      full_short_url: `${BASE_URL}/${u.short_code}`,
    }));

    res.json({ shortened: shortenedWithFullUrl, history: historyWithUrls });
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ username: req.username }).sort({
      created_at: -1,
    });

    const urlsWithFullUrl = urls.map((u) => ({
      ...u.toObject(),
      full_short_url: `${BASE_URL}/${u.short_code}`,
    }));

    res.json(urlsWithFullUrl);
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectToOriginal = async (req, res) => {
  try {
    const url = await Url.findOne({ short_code: req.params.short_code });
    if (!url) return res.status(404).send("URL not found");

    url.clicks++;
    await url.save();

    res.redirect(url.original_url);
  } catch (err) {
    console.error("Error redirecting:", err);
    res.status(500).send("Server error");
  }
};
