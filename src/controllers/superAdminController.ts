import { Request, Response } from 'express';
import SuperAdmin from '../models/SuperAdmin.js';
import Admin from '../models/Admin.js';
import College from '../models/College.js';
import { createToken } from '../utils/token-manager.js';
import bcrypt from 'bcrypt';
import { clearAndSetCookie } from '../utils/token-manager.js';
import exp from 'constants';

export const login = async (req: Request, res: Response) => {
    const {superAdminId, password} = req.body;
    try {
        const superAdmin = await SuperAdmin.findByPk(superAdminId);
        if (!superAdmin) {
            return res.status(404).json({error: 'SuperAdmin not found'});
        }
        if (!bcrypt.compareSync(password, superAdmin.password)) {
            return res.status(401).json({error: 'Invalid password'});
        }
        const token = createToken(superAdmin.superAdminId.toString(), 'superadmin', '1h');
        clearAndSetCookie(res, token);
        const userInfo = {
            id: superAdmin.superAdminId,
            name: superAdmin.superAdminName,
            role: 'superadmin'
        };
        res.status(200).json({userInfo, message: 'Login successful'});
    } catch (error) {
        console.error('SuperAdmin login error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const addSuperAdmin = async (req: Request, res: Response) => {
    const {superAdminId, superAdminName, password} = req.body;
    try {
        const superAdmin = await SuperAdmin.findByPk(superAdminId);
        if (superAdmin) {
            return res.status(409).json({error: 'SuperAdmin already exists'});
        }
        await SuperAdmin.create({superAdminId, superAdminName, password});
        res.status(201).json({message: 'SuperAdmin added successfully'});
    } catch (error) {
        console.error('SuperAdmin add error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
export const addCollege = async (req: Request, res: Response) => {
    const {collegeName, defaultStudentPassword} = req.body;
    try {
        const college = await College.findOne({ where: { collegeName } });
        if (college) {
            return res.status(409).json({error: 'College already exists'});
        }
        await College.create({collegeName, defaultStudentPassword});
        res.status(201).json({message: 'College added successfully'});
    } catch (error) {
        console.error('College add error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const addAdmin = async (req: Request, res: Response) => {
    const {adminId, adminName, password, collegeName} = req.body;
    try {
        const admin = await Admin.findByPk(adminId);
        if (admin) {
            return res.status(409).json({error: 'Admin already exists'});
        }
        const college = await College.findOne({ where: { collegeName } });
        if (!college) {
            return res.status(404).json({error: 'College not found'});
        }
        const collegeId = college.get().collegeId;
        await Admin.create({adminId, adminName, password, collegeId});
        res.status(201).json({message: 'Admin added successfully'});
    } catch (error) {
        console.error('Admin add error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const getColleges = async (req: Request, res: Response) => {
    try {
        const colleges = await College.findAll();
        res.status(200).json(colleges);
    } catch (error) {
        console.error('Colleges get error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const getAdminsByCollegeId = async (req: Request, res: Response) => {
    const collageId = req.params.collegeId;
    try {
        const admins = await Admin.findAll(
            {
                where: {
                    collegeId: collageId
                }
            }
        );
        res.status(200).json(admins);
    } catch (error) {
        console.error('Admins get error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const getSuperAdmins = async (req: Request, res: Response) => {
    try {
        const superAdmins = await SuperAdmin.findAll();
        res.status(200).json(superAdmins);
    } catch (error) {
        console.error('SuperAdmins get error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};


export const deleteCollege = async (req: Request, res: Response) => {
    const collegeId = req.params.collegeId;
    try {
        const college = await College.findByPk(collegeId);
        if (!college) {
            return res.status(404).json({error: 'College not found'});
        }
        await college.destroy();
        res.status(200).json({message: 'College deleted successfully'});
    } catch (error) {
        console.error('College delete error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
    const adminId = req.params.adminId;
    try {
        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({error: 'Admin not found'});
        }
        await admin.destroy();
        res.status(200).json({message: 'Admin deleted successfully'});
    } catch (error) {
        console.error('Admin delete error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const deleteSuperAdmin = async (req: Request, res: Response) => {
    const superAdminId = req.params.superAdminId;
    try {
        const superAdmin = await SuperAdmin.findByPk(superAdminId);
        if (!superAdmin) {
            return res.status(404).json({error: 'SuperAdmin not found'});
        }
        await superAdmin.destroy();
        res.status(200).json({message: 'SuperAdmin deleted successfully'});
    } catch (error) {
        console.error('SuperAdmin delete error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

