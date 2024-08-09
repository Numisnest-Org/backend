import UsersModel from "../models/users.model.js";
import { validateToken } from "../utils/jwt.js";

const sellerAuth = async (req, res, next) => {
   
        const id = Object.values(authUser)[0];
        const
                message:
                    "You are Suspended, please contact the customer service",
                data: null,
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

export default sellerAuth;
