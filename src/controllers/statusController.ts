import { Request, Response } from "express";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import SuperAdmin from "../models/SuperAdmin.js";
import { handleError } from "../utils/util.js";

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
        handleError(res, error, 'Logout error:');
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
            handleError(res, error, 'Student find error:');
        });
    } else if (role === 'admin') {
        Admin.findByPk(id).then((admin) => {
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }
            res.status(200).json({ id, role });
        }).catch((error) => {
            handleError(res, error, 'Admin find error:');
        });
    } else if (role === 'superadmin') {
        SuperAdmin.findByPk(id).then((superadmin) => {
            if (!superadmin) {
                return res.status(404).json({ error: 'SuperAdmin not found' });
            }
            res.status(200).json({ id, role });
        }).catch((error) => {
            handleError(res, error, 'SuperAdmin find error:');
        });
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
};