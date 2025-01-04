import { Request, Response } from "express";
import Student from "../models/student.js";
import Admin from "../models/Admin.js";
import SuperAdmin from "../models/SuperAdmin.js";
const COOKIE_NAME = process.env.COOKIE_NAME;
const NODE_ENV = process.env.NODE_ENV;

export const logout = (req: Request, res: Response) => {
    const cookieOptions = {
      httpOnly: true,
      signed: true,
      secure: NODE_ENV === 'production',
      path: "/",
    };
  
    try {
      res.clearCookie(COOKIE_NAME, cookieOptions);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
};

export const verifyUser = (req: Request, res: Response) => {
    const { id, role } = res.locals.jwtData;
    if (role === 'student') {
        Student.findByPk(id).then((student) => {
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }
            res.status(200).json({ id, role });
        }).catch((error) => {
            console.error('Student find error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
    } else if (role === 'admin') {
        Admin.findByPk(id).then((admin) => {
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }
            res.status(200).json({ id, role });
        }).catch((error) => {
            console.error('Admin find error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
    } else if (role === 'superadmin') {
        SuperAdmin.findByPk(id).then((superadmin) => {
            if (!superadmin) {
                return res.status(404).json({ error: 'SuperAdmin not found' });
            }
            res.status(200).json({ id, role });
        }).catch((error) => {
            console.error('SuperAdmin find error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
};