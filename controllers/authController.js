import userModel from "../models/userModel.js";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password, lastName } = req.body;
    // Validate input
    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already registered. Please login.");
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      name,
      email,
      password,
      lastName,
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      const error = new Error("Please provide all fields");
      error.statusCode = 201;
      throw error;
    }

    // Find user by email
    let user = await userModel.find({email});
    user=user[0];
    console.log(user.password);
    console.log(typeof(user.password));
    console.log(password);
    console.log(typeof(password));
    if (!user) {
      const error = new Error("Invalid username");
      error.statusCode = 300;
      throw error;
    }
    console.log("Hello1");
    // Compare password
    if (password===user.password) {
      const error = new Error("Invalid password");
      error.statusCode = 350;
      throw error;
    }
    console.log("Hello2");
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};
