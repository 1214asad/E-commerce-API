const createTokenUser = (user) => {
  return {
    userName: user.userName,
    userId: user._id,
    role: user.role,
  };
};

module.exports = createTokenUser;
