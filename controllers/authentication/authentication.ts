import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response , prisma : PrismaClient) => {
    const { email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);
    console.log("hash", hash);
  
    prisma.auth
      .create({
        data: {
          email,
          passwordHash: hash,
        },
      })
      .then(() => {
        prisma.user
          .create({
            data: {
              email,
              birth_date: new Date().toString(),
              first_name: "",
              last_name: "",
              phone_number: "",
            },
          })
          .finally(() => {
            res.status(200).json("User created");
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      })
      .catch((e) => {
        res.status(500).json("User not created");
      });
}

export const login = async (req: Request, res: Response, prisma : PrismaClient) => {
    try {
        const { email, password } = req.body;
        const userAth = await prisma.auth.findUnique({
          where: {
            email,
          },
        });
    
        if (!userAth) return res.status(404).json("User Not Found");
    
        const isValid = bcrypt.compareSync(password, userAth.passwordHash);
    
        if (!isValid) return res.status(401).json("Wrong password");
    
        // TODO: Generate JWT token
    
        const userProfile = await prisma.user.findUnique({
          where: {
            email,
          },
        });
    
        res.status(200).json(userProfile);
      } catch (e) {
        res.status(500).json(e);
      }
}