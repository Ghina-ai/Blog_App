import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../../validation/auth.validation";
import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../config/schema";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";

export class AuthController {

    //REGISTER
    register = async (req: Request, res: Response) => {
        try {
            const validatedData = registerSchema.parse(req.body);
            const { username, email, password } = validatedData;

            // 1. untuk mengecek email
            const existingEmail = await db.query.usersTable.findFirst({
                where: eq(usersTable.email, email),
            });

            if (existingEmail) {
                return res.status(409).json({
                success: false,
                message: "email already exists",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [insertedUser] = await db 
                .insert(usersTable)
                .values({
                    username: username,
                    email: email,
                    password: hashedPassword,
                })
                .$returningId();

            const newUser = await db.query.usersTable.findFirst({
                where: eq(usersTable.id, insertedUser.id),
            });

            return res.status(201).json({
                success: true,
                message: "register successfull",
                ddata: {
                    user: {
                        id: newUser?.id,
                        username: newUser?.username,
                        email: newUser?.email,
                        role: newUser?.role,
                    },
                },
            });


        } catch (error : any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "internal server error",
                error: error.message
            });

        }
    }

    //LOGIN
    login = async (req: Request, res: Response) => {
        try {
            const validatedData = loginSchema.parse(req.body);
            const { email, password } = validatedData;

            const user = await db.query.usersTable.findFirst({
                where: eq(usersTable.email, email)
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "email or password incorrect",
                });
            }

            const isPasswwordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswwordValid) {
                return res.status(401).json({
                        success: false,
                        message: "email or password incorrect",
                    });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: "7d",
                }
            );

            return res.status(200).json({
                success: true,
                message: "login successful",
                data: {
                    token: token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                },
            });
            

        } catch (error : any) {
            return res.status(500).json({
                success: false,
                message: "internal server error",
                error: error.message
            });

        }
    }
}

export default new AuthController()