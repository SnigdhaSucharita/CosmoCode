function getCsrfToken(req, res) {
  return res.json({
    csrfToken: req.csrfToken(),
  });
}

module.exports = { getCsrfToken };
