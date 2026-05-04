import { clerkClient } from "@clerk/express";
export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const userEmail = currentUser.primaryEmailAddress?.emailAddress?.trim().toLowerCase();

    if (adminEmail !== userEmail) {
      return res
        .status(403)
        .json({ message: "unauthorized - you must be an admin" });
    }

    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    next(error);
  }
};
