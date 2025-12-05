import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.js';

// REGISTER USER  -----------------------------------------------
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, verificationCode } = req.body;

  // -----------------------------
  // 1️⃣ Verify the 4-digit code
  // -----------------------------
  const REQUIRED_CODE = "1289"; // the code to verify
  if (verificationCode !== REQUIRED_CODE) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  // -----------------------------
  // 2️⃣ Check if user already exists
  // -----------------------------
  const userExists = await User.findOne({ phone });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // -----------------------------
  // 3️⃣ Create new user (role handled by Mongoose default)
  // -----------------------------
  const user = await User.create({
    name,
    email,
    phone,
    password,
    // role will default to "Collecting Agent" as per Mongoose schema
  });

  if (user) {
    // -----------------------------
    // 4️⃣ Set JWT cookie
    // -----------------------------
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getCollectingAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Collecting Agent" })
      .select("-password")  // remove password from response
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// LOGIN USER  --------------------------------------------------
const authUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    // Set JWT cookie
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
  } else {
    res.status(401);
    throw new Error('Invalid phone or password');
  }
});

// GET ALL USERS ------------------------------------------------
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// GET USER PROFILE ---------------------------------------------
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// UPDATE USER PROFILE ------------------------------------------
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Regenerate token if phone/email/password changed
    generateToken(res, updatedUser._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// GET USER BY ID (ADMIN) ---------------------------------------
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// UPDATE USER (ADMIN) ------------------------------------------
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// DELETE USER (ADMIN) ------------------------------------------
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// EXPORTS -------------------------------------------------------
export {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUser,
  getCollectingAgents,
};
