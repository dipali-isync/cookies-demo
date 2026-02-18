// controllers/auth.controller.ts
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import RefreshToken from "../../models/RefreshToken.js";

export const login = async (req, res) => {
  try {
    const { vEmail, vPassword } = req.body;

    // 1. Validate input
    if (!vEmail || !vPassword) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. Find user
    const user = await User.findOne({ vEmail });
    if (!user || !(await user.comparePassword(vPassword))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate tokens
    const accessToken = signAccessToken({ iUserId: user._id });
    const refreshToken = signRefreshToken({ iUserId: user._id });

    await RefreshToken.deleteMany({
      iUserId: user._id,
    });

    // 4. Save refresh token in DB
    await RefreshToken.create({
      iUserId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // 5. Set refresh token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // can't use Secure on plain HTTP
      path: "/", // valid for all paths
      maxAge: 5 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // can't use Secure on plain HTTP
      path: "/", // valid for all paths
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // 6. Send access token
    return res.status(200).json({
      status: "success",
      code: "200",
      message: "Login successful.",
      data: {
        accessToken,
        user: user,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    const storedToken = await RefreshToken.findOne({
      iUserId: user._id,
      token,
    });
    if (!storedToken) {
      // Clear cookies
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      // If you had set accessToken as a cookie, clear it too
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      return res.sendStatus(403);
    }

    const newAccessToken = signAccessToken({ iUserId: user._id });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });

    return res.json({
      message: "Token refreshed",
      code: 200,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { vFullName, vEmail, vPassword } = req.body;
    // 1. Validate input
    if (!vFullName || !vEmail || !vPassword) {
      return res
        .status(400)
        .json({ message: "Full name, email, and password required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ vEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(vPassword, 10);

    // 4. Create user
    const user = await User.create({
      vFullName,
      vEmail,
      vPassword: hashedPassword,
    });

    // 5. Generate tokens
    const accessToken = signAccessToken({ iUserId: user._id });
    const refreshToken = signRefreshToken({ iUserId: user._id });

    // 6. Save refresh token in DB
    await RefreshToken.create({
      iUserId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // 7. Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 5 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 8. Respond
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        vFullName: user.vFullName,
        vEmail: user.vEmail,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    console.log("accessToken", accessToken);

    if (refreshToken) {
      // Remove refresh token from DB
      await RefreshToken.deleteMany({ token: refreshToken });
    }

    // Clear cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // If you had set accessToken as a cookie, clear it too
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log("refreshToken", refreshToken);
    const tokenData = await RefreshToken.findOne({ token: refreshToken });
    console.log("++++++++++++++tokenData", tokenData);

    if (tokenData) {
      const user = await User.findOne({ _id: tokenData.iUserId });
      console.log("---------------user", user);
      return res.json({ message: "Got Data!!!!!!!", code: 200, data: user });
    } else {
      return res.status(401).json({ message: "Access denied" });
    }
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
