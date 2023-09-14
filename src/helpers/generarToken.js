import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const tokenSing = async (user) => {
    return jwt.sign(
        {
            _id: user.id,
            _role: user.trabajadore.area_id,
            _name: user.trabajadore.nombres+" "+user.trabajadore.apellidos
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h"
        }
    );
}

export const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export const decodeSign = (token) => {
    return jwt.decode(token, null);
}