import bcrypt from "bcrypt"
import Admin from "../models/Admin.js";
import College from "../models/College.js";
import { Request, Response } from "express";

export const addCollege = async (req: Request, res: Response) => {
  const { name, defaultPassword } = req.body;
  try {
    const existingCollege = await College.findOne({ where: { name } });
    if (existingCollege) {
      return res.status(409).json({ error: "College already exists." });
    }
    const newCollege = await College.create({
      name,
      defaultPassword,
    });
    res.status(201).json(newCollege);
  } catch (error) {
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

export const addAdmin = async (req: Request, res: Response) => {
  const { rollNumber, name, password, college } = req.body;
  try {
    const existingUser = await Admin.findOne({ where: { roll_number: rollNumber } });
    if (existingUser) {
      return res.status(409).json({ error: "Roll number already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Admin.create({
      roll_number: rollNumber,
      username: name,
      password: hashedPassword,
      college_id: college,
    });
    const { password: _, ...userWithoutPassword } = newUser.get();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};
