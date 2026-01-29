const getCurrentUser = async (req, res) => {
  res.status(200).set("Cache-Control", "no-store").json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt.toISOString(),
    },
  });
};

module.exports = { getCurrentUser };
