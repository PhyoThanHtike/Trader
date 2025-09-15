import prisma from "../utils/database.js";
import { generateToken } from "../utils/jwtUtils.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "USER",
      },
    });

    if (user) {
      generateToken(user.id, res);
      res.status(201).json({
        success: true,
        userId: user.id,
        userName: user.name,
        email: user.email,
        role: user.role,
        message: "User creatd successfully",
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ success:false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success:false, message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success:false, message: "Invalid credentials" });
    }

    generateToken(user.id, res);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.id,
        email: user.email,
        userName: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged Out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({userId});
    if(!user){
        return res.status(404).json({success: false, message:"User not found!"});
    }
    res.status(200).json({
        userId: user.id,
        userName: user.name,
        email: user.email,
        role: user.role
    });
  } catch (error) {
        console.log("User checking error", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
