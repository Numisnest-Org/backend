import UsersModel from "../models/users.model.js";
import { validateToken } from "../utils/jwt.js";

const collectorAuth = async (req, res, next) => {
    const token = req.headers["collector-auth"];

    if (!token) {
    
            return res.status(403).json({
                status: 403,
                message: "Access Denied, collector Route",
                data: null,
            });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            data: null,
        });
    }
};

export default collectorAuth;
