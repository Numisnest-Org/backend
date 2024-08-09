import axios from "axios";
import cache from "memory-cache";
import SellersModel from "../models/sellers.model.js";
import UsersModel from "../models/users.model.js";
import { Encrypt, Decrypt } from "../utils/bcrypt.js";
import { accessToken, logoutUser } from "../utils/jwt.js";
import {
    successResponse,
    failedResponse,
    invalidRequest,
    serverError,
} from "../utils/response.handler.js";
import { userInfo } from "../utils/userInfo.js";
import MessageModel from "../models/message.model.js";
import ItemsModel from "../models/items.model.js";
import photoUploader from "../utils/photoUploader.js";
import ContactusModel from "../models/contactus.model.js";
import InformationModels from "../models/information.models.js";

export const adminSignUp = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            cpassword,
            country_code,
            mobile,
        } = req.body;

        if (
            !first_name ||
            !last_name ||
            !email ||
            !password ||
            !cpassword ||
            !country_code ||
            !mobile
        ) {
            return invalidRequest(res, 400, req.body, "all input are required");
        }

        const userExist = await UsersModel.findOne({
            email: email,
        });

        if (userExist) {
            return failedResponse(
                res,
                400,
                null,
                "User with email already this exist"
            );
        }

        if (password !== cpassword) {
            return invalidRequest(res, 400, null, "pasword does not match");
        }

        const rxPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;

        if (!rxPattern.test(password)) {
            return invalidRequest(
                res,
                400,
                null,
                "password is too weak, use capital & small letter, interger and not less than 8 character"
            );
        }

        const newUser = new UsersModel({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: await Encrypt(password),
            country_code: country_code,
            mobile: mobile,
            about: "admin user",
            country: undefined,
            role: "admin",
            verify: true,
            suspended: undefined,
            auth_code: undefined,
        });

        await newUser.save();

        return successResponse(
            res,
            201,
            null,
            "New Admin User Created successfully"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const adminSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return invalidRequest(res, 400, req.body, "all input are required");
        }

        const userExist = await UsersModel.findOne({
            email: email,
        });

        if (!userExist) {
            return failedResponse(res, 400, null, "User does not exist");
        }

        if (userExist.role !== "admin") {
            return failedResponse(
                res,
                400,
                null,
                "You cannot sign-in here at admin login page"
            );
        }

        const passVerify = await Decrypt(password, userExist.password);

        if (!passVerify) {
            return invalidRequest(res, 400, null, "incorrect password");
        }

        if (!userExist.verify) {
            //todo send email.....
            return invalidRequest(
                res,
                400,
                null,
                "user email not verified, check your email for verification code"
            );
        }

        const token = await accessToken(
            userExist._id,
            userExist.email,
            userExist.role
        );

        await UsersModel.findOneAndUpdate(
            {
                role: "admin",
                _id: userExist._id,
                email: email,
            },
            {
                last_login: new Date(),
            },
            {
                upsert: true,
            }
        );

        return successResponse(
            res,
            201,
            {
                email: userExist.email,
                role: userExist.role,
                _id: userExist._id,
                token: token,
            },
            "Sign In successful"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

// export const logOut = async (req, res) => {
//     try {
//         const user = await UsersModel.findOne({
//             _id: req.user._id,
//         });

//         if (!user) {
//             return failedResponse(res, 400, null, "something went wrong");
//         }

//         const token = await logoutUser(user._id, user.email, user.role);

//         return successResponse(res, 200, token, "user signed out");
//     } catch (error) {
//         console.log(error.message);
//         return serverError(res, 500, null, error.message);
//     }
// };

export const adminGetSellers = async (req, res) => {
    try {
        const limit = req.query.limit || 20;
        const page = req.query.page || 1;

        let country = req?.query.country.toLowerCase();

        let sellers = [];
        let apage = [];

        if (country === "everywhere") {
            sellers = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                    },
                },
                {
                    $project: {
                        about: 0,
                        delivery_options: 0,
                        password: 0,
                    },
                },
                {
                    $sort: {
                        updatedAt: 1,
                    },
                },
                {
                    $skip: Number(Number(page) - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        } else {
            sellers = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                        country: country,
                    },
                },
                {
                    $project: {
                        about: 0,
                        delivery_options: 0,
                        password: 0,
                    },
                },
                {
                    $sort: {
                        updatedAt: 1,
                    },
                },
                {
                    $skip: Number(Number(page) - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await SellersModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: ["$role", "seller"],
                            $eq: ["$country", country],
                        },
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        }

        const resData = {
            sellers: sellers,
            page: `${page || 1} of ${Math.ceil(
                Number(apage[0]?.countPage) / Number(limit)
            )}`,
        };

        // cacheAndRespond(req, res, sellers, apage, page, limit);
        // const data = {
        //     data: resData,
        // };

        // const key = req.originalUrl || req.url;
        // cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "sellers data");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const adminSearchSellers = async (req, res) => {
    try {
        const search = req.query.search;

        const sellersRes = await SellersModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            role: "seller",
                        },
                        {
                            $or: [
                                {
                                    first_name: {
                                        $regex: search,
                                        $options: "i",
                                    },
                                },
                                {
                                    last_name: {
                                        $regex: search,
                                        $options: "i",
                                    },
                                },
                                { email: { $regex: search, $options: "i" } },
                                { _id: search },
                            ],
                        },
                    ],
                },
            },
        ]);

        return successResponse(
            res,
            200,
            {
                sellers: sellersRes,
            },
            "seller search result"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const adminUpdateSellerProfile = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            country_code,
            mobile,
            about,
            delivery_option,
            country,
            approved,
            suspended,
            level,
        } = req.body;

        const id = req.params.id;

        const seller = await SellersModel.findOne({
            _id: id,
        });

        const profilePix = await photoUploader(
            req,
            "profile_photo",
            `profile/${seller.email}`
        );

        await SellersModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                first_name: first_name,
                last_name: last_name,
                country_code: country_code,
                mobile: mobile,
                about: about,
                delivery_option: delivery_option,
                country: country?.toLowerCase(),
                photo: profilePix === false ? seller.photo : profilePix,
                approved: approved,
                suspended: suspended,
                level: level,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "seller profile updated");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const delSeller = async (req, res) => {
    try {
        const id = req.params.id;

        const collecter = await SellersModel.findOne({
            _id: id,
        });

        if (collecter?.role !== "seller" || !collecter) {
            return invalidRequest(res, 400, null, "not a seller _id");
        }

        await ItemsModel.deleteMany({ seller_id: id });

        await SellersModel.findOneAndDelete({
            _id: id,
        });

        return successResponse(res, 200, null, "collector removed");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const sellerProfile = async (req, res) => {
    try {
        const id = req.params.id;

        const userDtls = await SellersModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$_id",
                            {
                                $toObjectId: id,
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    password: 0,
                    auth_code: 0,
                    __v: 0,
                },
            },
        ]);

        return successResponse(res, 200, userDtls[0], "seller details");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const collectorProfile = async (req, res) => {
    try {
        const id = req.params.id;

        const userDtls = await UsersModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$_id",
                            {
                                $toObjectId: id,
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    password: 0,
                    auth_code: 0,
                    __v: 0,
                },
            },
        ]);

        return successResponse(res, 200, userDtls[0], "seller details");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const delCollector = async (req, res) => {
    try {
        const id = req.params.id;

        const collecter = await UsersModel.findOne({
            _id: id,
        });

        if (collecter?.role !== "collector" || !collecter) {
            return invalidRequest(res, 400, null, "not a collector _id");
        }

        await UsersModel.findOneAndDelete({
            _id: id,
        });

        return successResponse(res, 200, null, "collector removed");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const approveCollector = async (req, res) => {
    try {
        const id = req.params.id;

        const collecter = await UsersModel.findOne({
            _id: id,
        });

        if (collecter.role !== "collector") {
            return invalidRequest(res, 400, null, "not a collector _id");
        }

        await SellersModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                approved: true,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "collector approved");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const disApproveCollector = async (req, res) => {
    try {
        const id = req.params.id;

        const collecter = await UsersModel.findOne({
            _id: id,
        });

        if (collecter.role !== "collector") {
            return invalidRequest(res, 400, null, "not a collector _id");
        }

        await SellersModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                approved: false,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "collector disapproved");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const adminGetCollectors = async (req, res) => {
    try {
        const limit = req.query.limit || 20;
        const page = req.query.page || 1;

        let country = req?.query.country.toLowerCase();

        let collectors = [];
        let apage = [];

        if (country === "everywhere") {
            collectors = await UsersModel.aggregate([
                {
                    $match: {
                        role: "collector",
                    },
                },
                {
                    $project: {
                        about: 0,
                        delivery_options: 0,
                        password: 0,
                    },
                },
                {
                    $sort: {
                        updatedAt: 1,
                    },
                },
                {
                    $skip: Number(Number(page) - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await UsersModel.aggregate([
                {
                    $match: {
                        role: "collector",
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        } else {
            collectors = await UsersModel.aggregate([
                {
                    $match: {
                        role: "collector",
                        country: country,
                    },
                },
                {
                    $project: {
                        about: 0,
                        delivery_options: 0,
                        password: 0,
                    },
                },
                {
                    $sort: {
                        updatedAt: 1,
                    },
                },
                {
                    $skip: Number(Number(page) - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await UsersModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: ["$role", "collector"],
                            $eq: ["$country", country],
                        },
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        }

        const resData = {
            collectors: collectors,
            page: `${page || 1} of ${Math.ceil(
                Number(Number(apage[0]?.countPage)) / Number(limit)
            )}`,
        };

        // cacheAndRespond(req, res, collectors, apage, page, limit);
        const data = {
            data: resData,
        };

        const key = req.originalUrl || req.url;
        cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "collectors data");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const adminSearchCollectors = async (req, res) => {
    try {
        const search = req.query.search;

        const collectorRes = await UsersModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            role: "collector",
                        },
                        {
                            $or: [
                                {
                                    first_name: {
                                        $regex: search,
                                        $options: "i",
                                    },
                                },
                                {
                                    last_name: {
                                        $regex: search,
                                        $options: "i",
                                    },
                                },
                                { email: { $regex: search, $options: "i" } },
                                { _id: search },
                            ],
                        },
                    ],
                },
            },
        ]);

        return successResponse(
            res,
            200,
            {
                collectors: collectorRes,
            },
            "seller search result"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const pinItems = async (req, res) => {
    try {
        const id = req.params.id;

        const pinned = req.query.pin;

        await ItemsModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                pinned: pinned,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "items pin modified");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const pinSellers = async (req, res) => {
    try {
        const id = req.params.id;

        const pinned = req.query.pin;

        await SellersModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                pinned: pinned,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "sellers pin modified");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

async function convertCurrency(currency, pcurrency, price) {
    try {
        const { data } = await axios(
            // `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}/${pcurrency}.json`
            // ^older url
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency.toLowerCase()}.json`
        );

        const xrate = data[currency.toLowerCase()][pcurrency.toLowerCase()];

        return Number(xrate) * price;
    } catch (error) {
        console.log(error.message);
    }
}

export const adminGetItems = async (req, res) => {
    try {
        const limit = req.query.limit || 20;
        const page = req.query.page || 1;
        const currency = req.query.currency || "USD";

        let country = req?.query?.country
            ? req?.query?.country
            : uinfo?.country_name;

        let categ = req?.query?.category ? req?.query?.category : "";

        if (categ !== "") {
            categ = categ.toString().split(",");
        }

        country = country?.toLowerCase();

        if (currency && currency.length !== 3) {
            return invalidRequest(
                res,
                400,
                null,
                "currency value should be 3 in length"
            );
        }

        const userPreferredCurrency =
            currency.toLowerCase() || uinfo?.currency?.toLowerCase();

        let items = [];
        let apage = [];

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        if (categ === "") {
            items = await ItemsModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$available", true],
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", ""],
                                        },
                                        else: {
                                            $eq: ["$country", country],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        // about: 0,
                        delivery_options: 0,
                        password: 0,
                    },
                },
                {
                    $addFields: {
                        convertedPrice: {
                            $cond: {
                                if: {
                                    $eq: ["$currency", userPreferredCurrency],
                                },
                                then: "$price",
                                else: {
                                    $round: [
                                        {
                                            $multiply: ["$price", rate],
                                        },
                                        1,
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        convertedCurrency: userPreferredCurrency,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: {
                            sid: "$seller_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", { $toObjectId: "$$sid" }],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $sort: {
                        updatedAt: 1,
                    },
                },
                {
                    $skip: (Number(page) - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await ItemsModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$available", true],
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", ""],
                                        },
                                        else: {
                                            $eq: ["$country", country],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        } else {
            items = await ItemsModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$available", true],
                                },
                                {
                                    $in: ["$category", categ],
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", ""],
                                        },
                                        else: {
                                            $eq: ["$country", country],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        // about: 0,
                        delivery_options: 0,
                        password: 0,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: {
                            sid: "$seller_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", { $toObjectId: "$$sid" }],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $addFields: {
                        convertedPrice: {
                            $cond: {
                                if: {
                                    $eq: ["$currency", userPreferredCurrency],
                                },
                                then: "$price",
                                else: {
                                    $round: [
                                        {
                                            $multiply: ["$price", rate],
                                        },
                                        1,
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        convertedCurrency: userPreferredCurrency,
                    },
                },
                {
                    $sort: {
                        updatedAt: 1,
                    },
                },
                {
                    $skip: (Number(page) - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await ItemsModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$available", true],
                                },
                                {
                                    $in: ["$category", categ],
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", ""],
                                        },
                                        else: {
                                            $eq: ["$country", country],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        }

        const resData = {
            items: items,
            page: `${page || 1} of ${Math.ceil(
                Number(apage[0]?.countPage) / Number(limit)
            )}`,
        };

        const data = {
            data: resData,
        };

        const key = req.originalUrl || req.url;
        cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "items data");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const adminSearchItems = async (req, res) => {
    try {
        const search = req.query.search;

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo, ip);

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        const itemsRes = await ItemsModel.aggregate([
            {
                $match: {
                    $or: [
                        {
                            name: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                        {
                            description: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                        {
                            _id: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: {
                        sid: "$seller_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$sid" }],
                                },
                            },
                        },
                        {
                            $project: {
                                first_name: 1,
                                last_name: 1,
                            },
                        },
                    ],
                    as: "seller_info",
                },
            },
            {
                $addFields: {
                    convertedPrice: {
                        $cond: {
                            if: {
                                $eq: ["$currency", userPreferredCurrency],
                            },
                            then: "$price",
                            else: {
                                $round: [
                                    {
                                        $multiply: ["$price", rate],
                                    },
                                    1,
                                ],
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    convertedCurrency: userPreferredCurrency,
                },
            },
            // {
            //     $group: {
            //         _id: "$seller_id",
            //         item: {
            //             $push: "$$ROOT",
            //         },
            //     },
            // },
            // {
            //     $unwind: "$item",
            // },
        ]);

        return successResponse(
            res,
            200,
            {
                items: itemsRes,
            },
            "items search result"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const delItem = async (req, res) => {
    try {
        const itemid = req.params.id;

        await ItemsModel.findOneAndDelete({
            _id: itemid,
        });

        return successResponse(res, 200, null, "item deleted");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

/**
 * ADMIN DASHBOARD ENDPOINTS
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const logInfo = async (req, res) => {
    try {
        const admin = req.user;

        const lastlog = await UsersModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$_id", admin._id],
                    },
                },
            },
            {
                $project: {
                    last_login: 1,
                },
            },
        ]);

        const ipadd = req?.ip || req?.socket?.remoteAddress;

        return successResponse(
            res,
            200,
            {
                last_login: lastlog[0]?.last_login,
                ip_address: ipadd,
            },
            "admin log-in information fetched"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const overView = async (req, res) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set to the beginning of the day

        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1); // Set to the beginning of the next day

        const totSellers = await SellersModel.aggregate([
            {
                $match: {
                    role: "seller",
                },
            },
            {
                $count: "counter",
            },
        ]);

        const sellersToday = await SellersModel.aggregate([
            {
                $match: {
                    role: "seller",
                    createdAt: {
                        $gte: today,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $count: "counter",
            },
        ]);

        const totCollectors = await UsersModel.aggregate([
            {
                $match: {
                    role: "collector",
                },
            },
            {
                $count: "counter",
            },
        ]);

        const collectorsToday = await UsersModel.aggregate([
            {
                $match: {
                    role: "collector",
                    createdAt: {
                        $gte: today,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $count: "counter",
            },
        ]);

        const totItems = await ItemsModel.aggregate([
            // {
            //     $match: {
            //         $ne: ["$name", ""],
            //     },
            // },
            {
                $count: "counter",
            },
        ]);

        const itemsToday = await ItemsModel.aggregate([
            {
                $match: {
                    // $expr: {
                    //     $and: [
                    //         {
                    //             $ne: ["$name", ""],
                    //         },
                    //         {
                    //             $eq: ["$createdAt", new Date()],
                    //         },
                    //     ],
                    // },
                    createdAt: {
                        $gte: today,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $count: "counter",
            },
        ]);

        const totMessages = await MessageModel.aggregate([
            {
                $count: "counter",
            },
        ]);

        const messagesToday = await MessageModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: today,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $count: "counter",
            },
        ]);

        return successResponse(
            res,
            200,
            {
                tot_sellers: totSellers[0]?.counter,
                sellers_today: sellersToday[0]?.counter || 0, //Number(sellersToday[0]?.counter)*100/Number(totSellers[0]?.counter),
                tot_collectors: totCollectors[0]?.counter,
                collectors_today: collectorsToday[0]?.counter || 0,
                tot_items: totItems[0]?.counter,
                items_today: itemsToday[0]?.counter || 0,
                tot_messages: totMessages[0]?.counter,
                messages_today: messagesToday[0]?.counter || 0,
            },
            "website overview fetched"
        );
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const topSeller = async (req, res) => {
    try {
        const topSell = await SellersModel.aggregate([
            {
                $match: {
                    role: "seller",
                },
            },
            {
                $lookup: {
                    from: "items",
                    let: {
                        uid: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                seller_id: "$uid",
                            },
                        },
                    ],
                    as: "top",
                },
            },
            {
                $addFields: {
                    sellItems: { $size: "$top" },
                },
            },
            {
                $sort: {
                    sellItems: -1,
                },
            },
            {
                $limit: 5,
            },
        ]);

        return successResponse(
            res,
            200,
            topSell,
            "top valuable sellers fetched"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const totalItemsByCateg = async (req, res) => {
    try {
        const itemsCateg = await ItemsModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    categ_items: {
                        $push: "$$ROOT",
                    },
                },
            },
            {
                $unwind: "$_id",
            },
            {
                $group: {
                    _id: "$_id",
                    categ_items: {
                        $addToSet: "$categ_items",
                    },
                },
            },
        ]);

        return successResponse(
            res,
            200,
            itemsCateg,
            "top valuable sellers fetched"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

/**
 * ToDo
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const contactUsMessages = async (req, res) => {
    try {
        const messages = await ContactusModel.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);

        return successResponse(res, 200, messages, "messages fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const contactUsMessage = async (req, res) => {
    try {
        const mid = req.params.id;

        const message = await ContactusModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$_id",
                            {
                                $toObjectId: mid,
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "contact_us",
                    let: {
                        uem: "$email",
                        mid: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $ne: ["$_id", "$$mid"],
                                        },
                                        {
                                            $eq: ["$email", "$$uem"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                message: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    as: "other_messages",
                },
            },
        ]);

        return successResponse(res, 200, message[0], "message fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const usefulInfo = async (req, res) => {
    try {
        let { title, description, country } = req.body;

        if (!title || !description) {
            return invalidRequest(res, 400, null, "inputs are required");
        }

        if (country && country !== "") {
            country = country.toString().split(",");
        }

        let countr = [];

        if (country) {
            for (let x of country) {
                const lo = x.toLowerCase();
                countr.push(lo);
            }
        }

        await new InformationModels({
            title: title,
            description: description,
            country: countr,
        }).save();

        return successResponse(res, 200, null, "information posted");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const usefulInfoUpdate = async (req, res) => {
    try {
        const info_id = req.params.id;
        let { title, description, country } = req.body;

        if (country && country !== "") {
            country = country.toString().split(",");
        }

        let countr = [];

        if (country) {
            for (let x of country) {
                const lo = x.toLowerCase();
                countr.push(lo);
            }
        }

        await InformationModels.findOneAndUpdate(
            {
                _id: info_id,
            },
            {
                title: title,
                description: description,
                country: countr,
            },
            {
                upsert: true,
                new: true,
            }
        );

        return successResponse(res, 200, null, "information updated");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const usefulInfoDelete = async (req, res) => {
    try {
        const info_id = req.params.id;

        await InformationModels.findOneAndDelete({
            _id: info_id,
        });

        return successResponse(res, 200, null, "information deleted");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const usefulInfoAll = async (req, res) => {
    try {
        const country = req?.query?.country?.toLowerCase() || "everywhere";

        const info = await InformationModels.aggregate([
            {
                $match: {
                    $expr: {
                        $cond: {
                            if: {
                                $eq: [country, "everywhere"],
                            },
                            then: {
                                $ne: ["$country", []],
                            },
                            else: {
                                $in: [country, "$country"],
                            },
                        },
                    },
                },
            },
            {
                $sort: {
                    updatedAt: -1,
                },
            },
        ]);

        return successResponse(res, 200, info, "informations fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const usefulInfoOne = async (req, res) => {
    try {
        const info_id = req.params.id;

        const info = await InformationModels.findOne({ _id: info_id });

        return successResponse(res, 200, info, "information fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};
