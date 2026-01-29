function getCsrfToken(req, res) {
  return res.set("Cache-Control", "no-store").json({
    csrfToken: req.csrfToken(),
  });
}

module.exports = { getCsrfToken };
