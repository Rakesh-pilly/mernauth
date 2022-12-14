const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/User-model");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  // validating the user
  try {
    existingUser = await UserModel.findOne({ email });
  } catch (err) {}

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login Instead" });
  }
  const hashedPasswrord = bcrypt.hashSync(password);
  const user = new UserModel({ name, email, password: hashedPasswrord });
  //user is saved
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

  return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await UserModel.findOne({ email });
  } catch (error) {
    return new Error(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Singup Please!" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Email/Password" });
  }

  const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "40s",
  });

  console.log("Genertated Token\n", token);

  if (req.cookies[`${existingUser._id}`]) {
    req.cookies[`${existingUser._id}`] = "";
  }

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Succesfully Logged In", user: existingUser, token });
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(400).json({ message: "No cookies found" });
  }
  const token = cookies.split("=")[1];

  if (!token) {
    return res.status(400).json({ message: "No token Found" });
  }

  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    console.log(user.id);
    req.id = user.id;
  });

  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;

  let user;

  try {
    user = await UserModel.findById(userId, "-password");
  } catch (error) {
    return new Error(err);
  }

  if (!user) {
    return res.status(404).json({ message: "User Not found" });
  }

  return res.status(200).json({ user });
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(400).json({ message: "No cookies found" });
  }
  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication Failed" });
    }

    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "40s",
    });

    console.log("reFresh Token\n", token);

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), // 30 secounds
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;

    next();
  });
};

const logout = async (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(400).json({ message: "No cookies found" });
  }
  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication Failed" });
    }

    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    return res.status(200).json({message: "Successfully Loggout out"})
  });
};
exports.logout = logout;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
