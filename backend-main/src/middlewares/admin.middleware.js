import UsersModel from "../models/users.model.js";
import { validateToken } from "../utils/jwt.js";

const adminAuth = async (req, res, next) => {
    const token = req.header("admin-auth");

    if (!token) {
        return res.status(400).json({
            
        const id = Object.values(authUser)[0];
        const user = await UsersModel.findById({ _id: id });
        if (user.role !== "admin") {
            return res.status(403).json({
                status: 403,
                message: "Acce
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            data: null,
        });
    }
};

export default adminAuth;
