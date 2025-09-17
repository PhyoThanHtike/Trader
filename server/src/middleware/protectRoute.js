import jwt from "jsonwebtoken";
import prisma from "../utils/database.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // ✅ Fixed here
    if (!token) {
      return res.status(404).json({ message: "Token not found!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(404).json({ message: "Invalid Token" });
    }

    const id = decoded.userId;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
