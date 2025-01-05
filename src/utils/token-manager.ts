import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const COOKIE_NAME = process.env.COOKIE_NAME;
const JWT_SECRET = process.env.JWT_SECRET as string;
const NODE_ENV = process.env.NODE_ENV;


const handleJWTError = (error: any, res: Response) => {
  if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ error: "Token Expired" });
  } else if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ error: "Invalid Token" });
  } else {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyJWT = (req: Request, res: Response, next: NextFunction, requiredRole?: string) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token || token.trim() === "") {
    return res.status(401).json({ error: "Token Not Received" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.locals.jwtData = decoded;

    if (requiredRole && res.locals.jwtData.role !== requiredRole) {
      return res.status(403).json({ error: `Access denied. Not a ${requiredRole}.` });
    }

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return handleJWTError(error, res);
  }
};

export const clearAndSetCookie = (res: Response, token: string) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    domain: "localhost",
    signed: true,
    path: "/",
  });

  const cookieOptions = {
    httpOnly: true,
    signed: true,
    secure: NODE_ENV === 'production',
    maxAge: 3600000,
    path: "/"
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);
};

export const createToken = (rollnumber: string, role: string, expiresIn: string) => {
  const payload = { rollnumber, role };
  console.log("JWT_SECRET", JWT_SECRET);
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  verifyJWT(req, res, next);
};

export const verifyTokenStudent = (req: Request, res: Response, next: NextFunction) => {
  verifyJWT(req, res, next, "student");
};

export const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyJWT(req, res, next, "admin");
};

export const verifyTokenSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyJWT(req, res, next, "superadmin");
};

