import mongoose from "mongoose";
import ItemsModel from "../models/items.model.js";
import SellersModel from "../models/sellers.model.js";
import UsersModel from "../models/users.model.js";
import { authCode } from "../utils/authCode.js";
import { Encrypt, Decrypt } from "../utils/bcrypt.js";
import Email from "../utils/emailer.js";
import { userInfo } from "../utils/userInfo.js";
import { accessToken, logoutUser } from "../utils/jwt.js";
import {
    successResponse,
    failedResponse,
    invalidRequest,
    serverError,
} from "../utils/response.handler.js";
import FavouritesModel from "../models/favourites.model.js";
import axios from "axios";
import { countryToAlpha2 } from "country-to-iso";
import cache from "memory-cache";
import usersModel from "../models/users.model.js";
import photoUploader from "../utils/photoUploader.js";
import CollectionsModels from "../models/collections.models.js";
import RoomsModel from "../models/rooms.model.js";
import MessageModel from "../models/message.model.js";
import ContactusModel from "../models/contactus.model.js";
import FeaturedModels from "../models/featured.models.js";
import InformationModels from "../models/information.models.js";
import SellerVisibilityModel from "../models/sellerVisibility.model.js";
import sellerVisibilityModel from "../models/sellerVisibility.model.js";

export const collectorSignUp = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            cpassword,
            country_code,
            mobile,
            about,
            country,
        } = req.body;

        if (
            !first_name ||
            !last_name ||
            !email ||
            !password ||
            !cpassword ||
            !country_code ||
            !mobile ||
            !about ||
            !country
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

        const iso = countryToAlpha2(country.toLowerCase());

        const pin = Number(authCode(6));

        const newUser = new UsersModel({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: await Encrypt(password),
            country_code: country_code,
            mobile: mobile,
            about: about,
            country: country,
            iso_code: iso,
            role: "collector",
            auth_code: pin,
        });

        await newUser.save();

        //todo, send welcome and pin to email
        const userData = {
            firstName: first_name,
            lastName: last_name,
            email: email,
        };

        new Email(userData).sendVerifyEmail(pin);

        return successResponse(
            res,
            201,
            null,
            "New User Created successfully, check your email for verification token"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const signIn = async (req, res) => {
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

        const visible = await SellerVisibilityModel.aggregate([
            {
                $match: {
                    seller_id: userExist._id,
                },
            },
        ]);

        if (userExist.role == "seller" && visible.length === 0) {
            await SellerVisibilityModel.findOneAndUpdate(
                {
                    seller_id: userExist._id,
                },
                {
                    featured: true,
                    collections: true,
                    items: true,
                    messaging: true,
                    details: true,
                    profile: true,
                },
                {
                    upsert: true,
                    new: true,
                }
            );
        }

        const passVerify = await Decrypt(password, userExist.password);

        if (!passVerify) {
            return invalidRequest(res, 400, null, "incorrect password");
        }

        const pin = Number(authCode(6));

        if (!userExist.verify) {
            //todo send email.....
            await UsersModel.findOneAndUpdate(
                {
                    email: userExist.email,
                },
                {
                    auth_code: pin,
                },
                {
                    upsert: true,
                }
            );

            const userData = {
                firstName: userExist.first_name,
                lastName: userExist.last_name,
                email: userExist.email,
            };

            new Email(userData).sendVerifyEmail(pin);

            return invalidRequest(
                res,
                400,
                null,
                "user email not verified, check your email for verification code"
            );
        }

        if (userExist.suspended) {
            return invalidRequest(
                res,
                400,
                null,
                "you have been suspended from using our services, contact the admin"
            );
        }

        const token = await accessToken(
            userExist._id,
            userExist.email,
            userExist.role
        );

        return successResponse(
            res,
            201,
            {
                _id: userExist._id,
                email: userExist.email,
                role: userExist.role,
                token: token,
            },
            "Sign In successful"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, pin } = req.body;
        if (!email || !pin) {
            return invalidRequest(res, 400, null, "all input are required");
        }

        const pinUser = await UsersModel.findOne({
            email: email,
            verify: false,
        });

        if (!pinUser) {
            return invalidRequest(
                res,
                400,
                null,
                "invalid email or user email already verified"
            );
        }

        const pinVer = await UsersModel.findOne({
            email: email,
            auth_code: Number(pin),
        });

        if (!pinVer) {
            return invalidRequest(res, 400, null, "incorrect pin");
        }

        await UsersModel.findOneAndUpdate(
            {
                _id: pinVer._id,
                email: pinVer.email,
            },
            {
                verify: true,
                auth_code: undefined,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "user email verified");
    } catch (error) {
        console.log(error.message);
        return serverError(res, 500, null, error.message);
    }
};

export const passwordChangeCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return invalidRequest(res, 400, null, "all input are required");
        }

        const emailUser = await UsersModel.findOne({
            email: email,
        });

        if (!emailUser) {
            return invalidRequest(
                res,
                400,
                null,
                "invalid email , user does not exist"
            );
        }

        const pin = Number(authCode(8));

        await UsersModel.findOneAndUpdate(
            {
                _id: emailUser._id,
                email: emailUser.email,
            },
            {
                auth_code: pin,
            },
            {
                upsert: true,
            }
        );
        //todo send reset pass email

        const userData = {
            firstName: emailUser.first_name,
            lastName: emailUser.last_name,
            email: emailUser.email,
        };

        new Email(userData).sendResetPasswordToken(pin);

        return successResponse(
            res,
            200,
            null,
            "password reset email sent to registered email"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const contactUs = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number, message } =
            req.body;

        if (!first_name || !last_name || !email || !message) {
            return invalidRequest(
                res,
                200,
                null,
                "all feilds are required except phone number"
            );
        }

        const newMessage = new ContactusModel({
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            message: message,
        });

        await newMessage.save();

        return successResponse(res, 200, null, "message sent");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const passwordChange = async (req, res) => {
    try {
        const { email, pin, password, cpassword } = req.body;
        if (!email || !pin || !password || !cpassword) {
            return invalidRequest(res, 400, null, "all input are required");
        }

        const pinUser = await UsersModel.findOne({
            email: email,
            auth_code: Number(pin),
        });

        if (!pinUser) {
            return invalidRequest(
                res,
                400,
                null,
                "invalid credentials supplied"
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

        const newPass = await Encrypt(password);
        await UsersModel.findOneAndUpdate(
            {
                _id: pinUser._id,
                email: pinUser.email,
            },
            {
                password: newPass,
                auth_code: null,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "password changed successfully");
    } catch (error) {
        console.log(error.message);
        return serverError(res, 500, null, error.message);
    }
};

export const logOut = async (req, res) => {
    try {
        const user = await UsersModel.findOne({
            _id: req.user._id,
        });

        if (!user) {
            return failedResponse(res, 400, null, "something went wrong");
        }

        const token = await logoutUser(user._id, user.email, user.role);

        return successResponse(res, 200, token, "user signed out");
    } catch (error) {
        console.log(error.message);
        return serverError(res, 500, null, error.message);
    }
};

/**
 * get items, get item
 */
async function convertCurrency(currency, pcurrency, price) {
    try {
        // const xrate = await axios.get(`https://data.fixer.io/api/convert
        //     ? access_key = ${process.env.FIXER_API_KEY}
        //     & from = ${currency}
        //     & to = ${pcurrency}
        //     & amount = ${price}`);

        // console.log(currency, pcurrency, price);

        const { data } = await axios(
            // `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}/${pcurrency}.json`
            // ^older url
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency.toLowerCase()}.json`
        );

        // const xrate = Object.values(data);
        const xrate = data[currency.toLowerCase()][pcurrency.toLowerCase()];

        return Number(xrate) * price;
    } catch (error) {
        console.log(error.message);
    }
}

async function interleaveItems(items) {
    let groupedByDay = {};
    items.forEach((item) => {
        let dateKey = new Date(item.item.updatedAt).toISOString().split("T")[0];
        groupedByDay[dateKey] = groupedByDay[dateKey] || [];
        groupedByDay[dateKey].push(item);
    });

    let interleaved = [];
    for (let dateKey in groupedByDay) {
        let groupedBySeller = {};
        groupedByDay[dateKey].forEach((item) => {
            groupedBySeller[item.item.seller_id] =
                groupedBySeller[item.item.seller_id] || [];
            groupedBySeller[item.item.seller_id].push(item);
        });
        let dailyInterleaved = [];
        let maxItemsPerSeller = Math.max(
            ...Object.values(groupedBySeller).map((arr) => arr.length)
        );
        for (let i = 0; i < maxItemsPerSeller; i++) {
            for (let sellerId in groupedBySeller) {
                let sellerItems = groupedBySeller[sellerId];
                if (sellerItems[i]) {
                    dailyInterleaved.push(sellerItems[i]);
                }
            }
        }
        interleaved.push(...dailyInterleaved);
    }

    return interleaved;
}

export const getItems = async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress;

        const uinfo = await userInfo(ip); //"212.113.115.165 || 152.58.57.238"
        console.log(uinfo, ip);

        const limit = req.query.limit || 20;
        const page = req.query.page || 1;
        const currency = req.query.currency;

        let scountry = req?.query?.scountry
            ? req?.query?.scountry.toLowerCase()
            : "everywhere";

        let country = req?.query?.country ? req?.query?.country : "everywhere";

        let year = req?.query?.year || "";

        const minYear = Number(year?.toString()?.split(".")[0]) || -Infinity;
        const maxYear = Number(year?.toString()?.split(".")[1]) || +Infinity;

        let categ = req?.query?.category ? req?.query?.category : "";

        if (categ !== "") {
            categ = categ.toString().split(",");
        }

        country = country?.toLowerCase();

        // country = [country];

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
                                    $gte: [
                                        "$updatedAt",
                                        {
                                            $subtract: [
                                                new Date(),
                                                90 * 24 * 60 * 60 * 1000,
                                            ],
                                        },
                                    ],
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", undefined],
                                        },
                                        else: {
                                            $in: [country, "$country"],
                                        },
                                    },
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [year, ""],
                                        },
                                        then: {
                                            $ne: ["$name", undefined],
                                        },
                                        else: {
                                            $and: [
                                                {
                                                    $gte: ["$year", minYear],
                                                },
                                                {
                                                    $lte: ["$year", maxYear],
                                                },
                                            ],
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
                                        $and: [
                                            {
                                                $eq: [
                                                    "$_id",
                                                    { $toObjectId: "$$sid" },
                                                ],
                                            },
                                            {
                                                $eq: ["$approved", true],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                    country: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $match: { seller_info: { $ne: [] } },
                },
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $eq: [scountry, "everywhere"] },
                                then: {
                                    $ne: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        "",
                                    ],
                                },
                                else: {
                                    $eq: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        scountry,
                                    ],
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
                {
                    $group: {
                        _id: "$seller_id",
                        item: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        item: { $slice: ["$item", 100] },
                    },
                },
                {
                    $unwind: "$item",
                },
                {
                    $sort: {
                        "item.updatedAt": -1,
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
                                    $gte: [
                                        "$updatedAt",
                                        {
                                            $subtract: [
                                                new Date(),
                                                90 * 24 * 60 * 60 * 1000,
                                            ],
                                        },
                                    ],
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", undefined],
                                        },
                                        else: {
                                            $in: [country, "$country"],
                                        },
                                    },
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [year, ""],
                                        },
                                        then: {
                                            $ne: ["$name", undefined],
                                        },
                                        else: {
                                            $and: [
                                                {
                                                    $gte: ["$year", minYear],
                                                },
                                                {
                                                    $lte: ["$year", maxYear],
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
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
                                        $and: [
                                            {
                                                $eq: [
                                                    "$_id",
                                                    { $toObjectId: "$$sid" },
                                                ],
                                            },
                                            {
                                                $eq: ["$approved", true],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                    country: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $match: { seller_info: { $ne: [] } },
                },
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $eq: [scountry, "everywhere"] },
                                then: {
                                    $ne: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        "",
                                    ],
                                },
                                else: {
                                    $eq: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        scountry,
                                    ],
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
                {
                    $group: {
                        _id: "$seller_id",
                        item: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        item: { $slice: ["$item", 100] },
                    },
                },
                {
                    $unwind: "$item",
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
                                    $gte: [
                                        "$updatedAt",
                                        {
                                            $subtract: [
                                                new Date(),
                                                90 * 24 * 60 * 60 * 1000,
                                            ],
                                        },
                                    ],
                                },
                                {
                                    $or: categ?.map((element) => ({
                                        $in: [element, "$category"],
                                    })),
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", undefined],
                                        },
                                        else: {
                                            $in: [country, "$country"],
                                        },
                                    },
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [year, ""],
                                        },
                                        then: {
                                            $ne: ["$name", undefined],
                                        },
                                        else: {
                                            $and: [
                                                {
                                                    $gte: ["$year", minYear],
                                                },
                                                {
                                                    $lte: ["$year", maxYear],
                                                },
                                            ],
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
                                        $and: [
                                            {
                                                $eq: [
                                                    "$_id",
                                                    { $toObjectId: "$$sid" },
                                                ],
                                            },
                                            {
                                                $eq: ["$approved", true],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                    country: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $match: { seller_info: { $ne: [] } },
                },
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $eq: [scountry, "everywhere"] },
                                then: {
                                    $ne: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        "",
                                    ],
                                },
                                else: {
                                    $eq: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        scountry,
                                    ],
                                },
                            },
                        },
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
                                    // $function: {
                                    //     body: convertCurrency().toString(),
                                    //     args: [
                                    //         "$currency",
                                    //         userPreferredCurrency,
                                    //         "$price",
                                    //     ],
                                    //     lang: "js",
                                    // },
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
                        updatedAt: -1,
                    },
                },
                {
                    $group: {
                        _id: "$seller_id",
                        item: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        item: { $slice: ["$item", 100] },
                    },
                },
                {
                    $unwind: "$item",
                },
                {
                    $sort: {
                        "item.updatedAt": -1,
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
                                    $gte: [
                                        "$updatedAt",
                                        {
                                            $subtract: [
                                                new Date(),
                                                90 * 24 * 60 * 60 * 1000,
                                            ],
                                        },
                                    ],
                                },
                                {
                                    $or: categ?.map((element) => ({
                                        $in: [element, "$category"],
                                    })),
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [country, "everywhere"],
                                        },
                                        then: {
                                            $ne: ["$country", undefined],
                                        },
                                        else: {
                                            $in: [country, "$country"],
                                        },
                                    },
                                },
                                {
                                    $cond: {
                                        if: {
                                            $eq: [year, ""],
                                        },
                                        then: {
                                            $ne: ["$name", undefined],
                                        },
                                        else: {
                                            $and: [
                                                {
                                                    $gte: ["$year", minYear],
                                                },
                                                {
                                                    $lte: ["$year", maxYear],
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
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
                                        $and: [
                                            {
                                                $eq: [
                                                    "$_id",
                                                    { $toObjectId: "$$sid" },
                                                ],
                                            },
                                            {
                                                $eq: ["$approved", true],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                    country: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $match: { seller_info: { $ne: [] } },
                },
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $eq: [scountry, "everywhere"] },
                                then: {
                                    $ne: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        "",
                                    ],
                                },
                                else: {
                                    $eq: [
                                        {
                                            $arrayElemAt: [
                                                "$seller_info.country",
                                                0,
                                            ],
                                        },
                                        scountry,
                                    ],
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
                {
                    $group: {
                        _id: "$seller_id",
                        item: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        item: { $slice: ["$item", 100] },
                    },
                },
                {
                    $unwind: "$item",
                },
                {
                    $count: "countPage",
                },
            ]);
        }

        // console.log(items);

        items = await interleaveItems(items);

        const resData = {
            items: items,
            page: `${page || 1} of ${Math.ceil(
                Number(apage[0]?.countPage) / Number(limit)
            )}`,
            counts: apage[0]?.countPage,
        };

        // const data = {
        //     data: resData,
        // };

        // const key = req.originalUrl || req.url;
        // cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "items data");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const pinnedSeller = async (req, res) => {
    try {
        const pinnedSellers = await SellersModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ["$role", "seller"],
                            },
                            {
                                $eq: ["$pinned", true],
                            },
                        ],
                    },
                },
            },
        ]);

        return successResponse(res, 200, pinnedSellers, "pinned seller");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const pinnedItems = async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress;

        const uinfo = await userInfo(ip); //"212.113.115.165 ||  152.58.57.238"

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        const pinnedItems = await ItemsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ["$available", true],
                            },
                            {
                                $gte: [
                                    "$updatedAt",
                                    {
                                        $subtract: [
                                            new Date(),
                                            90 * 24 * 60 * 60 * 1000,
                                        ],
                                    },
                                ],
                            },
                            {
                                $eq: ["$pinned", true],
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
                                    0,
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
                                country: 1,
                            },
                        },
                    ],
                    as: "seller_info",
                },
            },
            {
                $group: {
                    _id: "$seller_id",
                    item: { $push: "$$ROOT" },
                },
            },
            {
                $unwind: "$item",
            },
            {
                $sort: {
                    "item.updatedAt": -1,
                },
            },
        ]);

        return successResponse(res, 200, pinnedItems, "pinned items");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const getItem = async (req, res) => {
    try {
        const item = await ItemsModel.findOne({ _id: req.params.id });

        const ip = req.ip || req.socket.remoteAddress;

        const uinfo = await userInfo(ip); //"212.113.115.165 ||  152.58.57.238"

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        const rate = await convertCurrency(
            item?.currency?.toLowerCase(),
            userPreferredCurrency,
            1
        );

        const items = await ItemsModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.params.id),
                },
            },
            {
                $project: {
                    __v: 0,
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
                                    0,
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
                                password: 0,
                            },
                        },
                    ],
                    as: "seller_info",
                },
            },
            {
                $lookup: {
                    from: "items",
                    let: {
                        iid: "$_id",
                        ocat: "$category",
                        countri: "$country",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $ne: ["$_id", "$$iid"],
                                        },
                                        {
                                            $gt: [
                                                {
                                                    $size: {
                                                        $setIntersection: [
                                                            "$category",
                                                            "$$ocat",
                                                        ],
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                        {
                                            $setIsSubset: [
                                                "$country",
                                                "$$countri",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                __v: 0,
                            },
                        },
                        {
                            $limit: 10,
                        },
                    ],
                    as: "similar_items",
                },
            },
        ]);

        return successResponse(
            res,
            200,
            items,
            "one item data with details fetched"
        );
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const getItemsHome = async (req, res) => {
    try {
        const limit = req.query.limit || 20;
        const page = req.query.page || 1;

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo);

        let country = req?.query?.country?.toLowerCase() || "everywhere";

        let ipcountry = uinfo?.country_name?.toLowerCase();

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        let items = [];
        let apage = [];

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        // console.log(rate , "this is converted rate ")

        if (country === "everywhere") {
            items = await ItemsModel.aggregate([
                {
                    $match: {
                        available: true,
                        pinned: false,
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
                                        $and: [
                                            {
                                                $eq: [
                                                    "$_id",
                                                    { $toObjectId: "$$sid" },
                                                ],
                                            },
                                            {
                                                $eq: ["$approved", true],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                    country: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $match: { seller_info: { $ne: [] } },
                },
                {
                    $sort: {
                        updatedAt: -1,
                    },
                },
                {
                    $group: {
                        _id: "$seller_id",
                        item: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        item: { $slice: ["$item", 30] },
                    },
                },
                {
                    $unwind: "$item",
                },
                {
                    $sort: {
                        "item.updatedAt": -1,
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
                        available: true,
                        pinned: false,
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        } else if (country === "userlocation") {
            items = await ItemsModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$available", true],
                                },
                                {
                                    $in: [ipcountry, "$country"],
                                },
                                {
                                    $eq: ["$pinned", false],
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
                                        $and: [
                                            {
                                                $eq: [
                                                    "$_id",
                                                    { $toObjectId: "$$sid" },
                                                ],
                                            },
                                            {
                                                $eq: ["$approved", true],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                    country: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $match: { seller_info: { $ne: [] } },
                },
                {
                    $sort: {
                        updatedAt: -1,
                    },
                },
                {
                    $group: {
                        _id: "$seller_id",
                        item: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        item: { $slice: ["$item", 30] },
                    },
                },
                {
                    $unwind: "$item",
                },
                {
                    $sort: {
                        "item.updatedAt": -1,
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
                                    $in: [ipcountry, "$country"],
                                },
                                {
                                    $eq: ["$pinned", false],
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
                                    $in: [country, "$country"],
                                },
                                {
                                    $eq: ["$pinned", false],
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
                                        $and: [
                                            {
                                                $eq: [
                                                    "$_id",
                                                    { $toObjectId: "$$sid" },
                                                ],
                                            },
                                            {
                                                $eq: ["$approved", true],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    first_name: 1,
                                    last_name: 1,
                                    country: 1,
                                },
                            },
                        ],
                        as: "seller_info",
                    },
                },
                {
                    $match: { seller_info: { $ne: [] } },
                },
                {
                    $sort: {
                        updatedAt: -1,
                    },
                },
                {
                    $group: {
                        _id: "$seller_id",
                        item: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        item: { $slice: ["$item", 30] },
                    },
                },
                {
                    $unwind: "$item",
                },
                {
                    $sort: {
                        "item.updatedAt": -1,
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
                                    $in: [country, "$country"],
                                },
                                {
                                    $eq: ["$pinned", false],
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

        items = await interleaveItems(items);

        const resData = {
            items: items,
            page: `${page || 1} of ${Math.ceil(
                Number(apage[0]?.countPage) / Number(limit)
            )}`,
        };

        // const data = {
        //     data: resData,
        // };

        // const key = req.originalUrl || req.url;
        // cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "items data");
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

/**
 * get sellers, get seller
 */
export const getSellers = async (req, res) => {
    try {
        const limit = req.query.limit || 20;
        const page = req.query.page || 1;

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo);

        let country = req?.query?.country?.toLowerCase();

        let ipcountry = uinfo?.country_name?.toLowerCase();

        let sellers = [];
        let apage = [];

        if (country === "everywhere") {
            sellers = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                        approved: true,
                        pinned: false,
                    },
                },
                {
                    $lookup: {
                        from: "items",
                        let: {
                            sellerId: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$seller_id", "$$sellerId"],
                                    },
                                },
                            },
                            {
                                $sort: { updatedAt: -1 },
                            },
                            {
                                $limit: 1,
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    updatedAt: 1,
                                },
                            },
                        ],
                        as: "latestItem",
                    },
                },
                {
                    $addFields: {
                        latestItem: { $arrayElemAt: ["$latestItem", 0] },
                    },
                },
                {
                    $sort: {
                        "latestItem.updatedAt": -1,
                    },
                },
                {
                    $skip: Number(page - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                        approved: true,
                        pinned: false,
                    },
                },
                {
                    $count: "countPage",
                },
            ]);
        } else if (country === "userlocation") {
            sellers = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                        country: ipcountry,
                        approved: true,
                        pinned: false,
                    },
                },
                {
                    $lookup: {
                        from: "items",
                        let: {
                            sellerId: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$seller_id", "$$sellerId"],
                                    },
                                },
                            },
                            {
                                $sort: { updatedAt: -1 },
                            },
                            {
                                $limit: 1,
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    updatedAt: 1,
                                },
                            },
                        ],
                        as: "latestItem",
                    },
                },
                {
                    $addFields: {
                        latestItem: { $arrayElemAt: ["$latestItem", 0] },
                    },
                },
                {
                    $sort: {
                        "latestItem.updatedAt": 1,
                    },
                },
                {
                    $skip: Number(page - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                        country: ipcountry,
                        approved: true,
                        pinned: false,
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
                        approved: true,
                        pinned: false,
                    },
                },
                {
                    $lookup: {
                        from: "items",
                        let: {
                            sellerId: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$seller_id", "$$sellerId"],
                                    },
                                },
                            },
                            {
                                $sort: { updatedAt: -1 },
                            },
                            {
                                $limit: 1,
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    updatedAt: 1,
                                },
                            },
                        ],
                        as: "latestItem",
                    },
                },
                {
                    $addFields: {
                        latestItem: { $arrayElemAt: ["$latestItem", 0] },
                    },
                },
                {
                    $sort: {
                        "latestItem.updatedAt": -1,
                    },
                },
                {
                    $skip: Number(page - 1) * Number(limit) || 0,
                },
                {
                    $limit: Number(limit) || 20,
                },
            ]);

            apage = await SellersModel.aggregate([
                {
                    $match: {
                        role: "seller",
                        country: country,
                        approved: true,
                        pinned: false,
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
                Number(Number(apage[0]?.countPage)) / Number(limit)
            )}`,
        };

        // cacheAndRespond(req, res, sellers, apage, page, limit);
        // const data = {
        //     data: resData,
        // };

        // const key = req.originalUrl || req.url;
        // cache.put(key, data, 30 * 60 * 1000);

        // console.log(data.values, "rgrgrgrgg");
        return successResponse(res, 200, resData, "sellers data");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const getSeller = async (req, res) => {
    const user = req.params;
    try {
        const checkVis = await SellerVisibilityModel.findOne({
            seller_id: user.id,
        });

        if (checkVis && !checkVis?.profile) {
            return failedResponse(res, 403, [], "seller profile not available");
        }

        const seller = await SellersModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.params.id),
                    approved: true,
                },
            },
            {
                $project: {
                    password: 0,
                },
            },
            // {
            //     $lookup: {
            //         from: "items",
            //         let: {
            //             sid: "$_id",
            //         },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: {
            //                         $eq: ["$seller_id", "$$sid"],
            //                     },
            //                 },
            //             },
            //             {
            //                 $project: {
            //                     name: 1,
            //                     photo1: 1,
            //                     photo2: 1,
            //                     description: 1,
            //                     price: 1,
            //                 },
            //             },
            //             {
            //                 $sort: {
            //                     updatedAt: 1,
            //                 },
            //             },
            //             {
            //                 $limit: 6,
            //             },
            //         ],
            //         as: "seller_featured_items",
            //     },
            // },
        ]);

        return successResponse(res, 200, seller[0], "sellers data");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const sellerFeaturedItems = async (req, res) => {
    try {
        const user = req.params;

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo);

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        const checkVis = await SellerVisibilityModel.findOne({
            seller_id: user.id,
        });

        if (checkVis && !checkVis?.featured) {
            return failedResponse(
                res,
                403,
                [],
                "seller featured items not available"
            );
        }

        const featItems = await FeaturedModels.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$seller_id",
                            {
                                $toObjectId: user.id,
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "items",
                    let: {
                        iids: "$items_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        {
                                            $toString: "$_id",
                                        },
                                        "$$iids",
                                    ],
                                },
                            },
                        },
                        {
                            $addFields: {
                                convertedPrice: {
                                    $cond: {
                                        if: {
                                            $eq: [
                                                "$currency",
                                                userPreferredCurrency,
                                            ],
                                        },
                                        then: "$price",
                                        else: {
                                            // $function: {
                                            //     body: async function (
                                            //         currency,
                                            //         userPreferredCurrency,
                                            //         price
                                            //     ) {
                                            //         console.log(
                                            //             currency,
                                            //             userPreferredCurrency,
                                            //             price
                                            //         );

                                            //         const { data } = await axios(
                                            //             `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.toLowerCase}/${userPreferredCurrency.toLowerCase}.json`
                                            //         );

                                            //         const xrate = Object.values(data);

                                            //         return Number(xrate[1]) * price;
                                            //     },
                                            //     args: [
                                            //         "$currency",
                                            //         "userPreferredCurrency",
                                            //         "$price",
                                            //     ],
                                            //     lang: "js",
                                            // },
                                            $round: [
                                                {
                                                    $multiply: ["$price", rate],
                                                },
                                                0,
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
                    ],
                    as: "featured_items",
                },
            },
        ]);

        return successResponse(res, 200, featItems, "seller featured items");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const sellerItems = async (req, res) => {
    try {
        const seller = req.params.id;

        const checkVis = await SellerVisibilityModel.findOne({
            seller_id: seller,
        });

        if (checkVis && !checkVis?.items) {
            return failedResponse(res, 403, [], "seller items not available");
        }

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo, ip);

        const limit = req.query.limit || 20;
        const page = req.query.page || 1;

        let country = req?.query.country
            ? req?.query?.country?.toLowerCase()
            : "everywhere";

        let categ = req?.query?.category ? req?.query?.category : "";

        if (categ !== "") {
            categ = categ.toString().split(",");
        }

        const userPreferredCurrency =
            req?.query?.currency?.toLowerCase() ||
            uinfo?.currency?.toLowerCase();

        // let items = [];
        // let apage = [];

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        let items = [];
        let apage = [];

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
                                    $eq: [
                                        "$seller_id",
                                        {
                                            $toObjectId: seller,
                                        },
                                    ],
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
                        updatedAt: -1,
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
                                    $eq: [
                                        "$seller_id",
                                        {
                                            $toObjectId: seller,
                                        },
                                    ],
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
                                    $eq: [
                                        "$seller_id",
                                        {
                                            $toObjectId: seller,
                                        },
                                    ],
                                },
                                {
                                    $or: categ?.map((element) => ({
                                        $in: [element, "$category"],
                                    })),
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
                        updatedAt: -1,
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
                                    $eq: [
                                        "$seller_id",
                                        {
                                            $toObjectId: seller,
                                        },
                                    ],
                                },
                                {
                                    $or: categ?.map((element) => ({
                                        $in: [element, "$category"],
                                    })),
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

        return successResponse(
            res,
            200,
            {
                items: items,
                page: `${page || 1} of ${Math.ceil(
                    Number(apage[0]?.countPage) / Number(limit)
                )}`,
            },
            "items data"
        );

        // return successResponse(res, 200, items, "seller items fetched");
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const searchSellerItem = async (req, res) => {
    try {
        const search = req.query.search;

        const seller_id = req.params.id;

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo, ip);

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        const itemsRes = await ItemsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$seller_id",
                            {
                                $toObjectId: seller_id,
                            },
                        ],
                    },
                },
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        {
                            description: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                        { _id: { $regex: search, $options: "i" } },
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
                                // $function: {
                                //     body: async function (
                                //         currency,
                                //         userPreferredCurrency,
                                //         price
                                //     ) {
                                //         console.log(
                                //             currency,
                                //             userPreferredCurrency,
                                //             price
                                //         );

                                //         const { data } = await axios(
                                //             `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.toLowerCase}/${userPreferredCurrency.toLowerCase}.json`
                                //         );

                                //         const xrate = Object.values(data);

                                //         return Number(xrate[1]) * price;
                                //     },
                                //     args: [
                                //         "$currency",
                                //         "userPreferredCurrency",
                                //         "$price",
                                //     ],
                                //     lang: "js",
                                // },
                                $round: [
                                    {
                                        $multiply: ["$price", rate],
                                    },
                                    0,
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
            "seller items search result"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

// export const sellerItemsCateg = async (req, res) => {
//     try {
//         const seller = req.params.id;

//         const items = await ItemsModel.aggregate([
//             {
//                 $match: {
//                     $expr: {
//                         $eq: [
//                             "$seller_id",
//                             {
//                                 $toObjectId: seller,
//                             },
//                         ],
//                     },
//                 },
//             },
//             // {
//             //     $limit: 4,
//             // },
//             {
//                 $group: {
//                     _id: "$category",
//                     data: { $push: "$$ROOT" },
//                 },
//             },
//         ]);

//         return successResponse(res, 200, items, "seller items fetched");
//     } catch (error) {
//         return serverError(res, 500, null, error.message);
//     }
// };

export const sellerCollections = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const checkVis = await SellerVisibilityModel.findOne({
            seller_id: sellerId,
        });

        if (checkVis && !checkVis.collections) {
            return failedResponse(
                res,
                403,
                [],
                "seller collections not available"
            );
        }

        const collection = await CollectionsModels.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    "$seller_id",
                                    {
                                        $toObjectId: sellerId,
                                    },
                                ],
                            },
                            {
                                $ne: ["$hidden", true],
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "items",
                    let: {
                        iids: "$items_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        {
                                            $toString: "$_id",
                                        },
                                        "$$iids",
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                seller_id: 1,
                                name: 1,
                                description: 1,
                                firstPhoto: {
                                    $arrayElemAt: ["$photos", 0],
                                },
                            },
                        },
                    ],
                    as: "coll_list",
                },
            },
        ]);

        return successResponse(res, 200, collection, "seller items collection");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const sellerCollection = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const coll_id = req.query.coll_id;

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo, ip);

        const userPreferredCurrency = uinfo?.currency?.toLowerCase() || "usd";

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        const collection = await CollectionsModels.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    "$seller_id",
                                    {
                                        $toObjectId: sellerId,
                                    },
                                ],
                            },
                            {
                                $eq: [
                                    "$_id",
                                    {
                                        $toObjectId: coll_id,
                                    },
                                ],
                            },
                            {
                                $ne: ["$hidden", true],
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "items",
                    let: {
                        iids: "$items_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        {
                                            $toString: "$_id",
                                        },
                                        "$$iids",
                                    ],
                                },
                            },
                        },
                        {
                            $addFields: {
                                convertedPrice: {
                                    $cond: {
                                        if: {
                                            $eq: [
                                                "$currency",
                                                userPreferredCurrency,
                                            ],
                                        },
                                        then: "$price",
                                        else: {
                                            $round: [
                                                {
                                                    $multiply: ["$price", rate],
                                                },
                                                0,
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
                    ],
                    as: "coll_list",
                },
            },
        ]);

        return successResponse(res, 200, collection, "seller items collection");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

//authenticated endpoints

/**
 * Auth Endpoints
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const cgetProfile = async (req, res) => {
    try {
        const user = req.user;
        const userDtls = await UsersModel.aggregate([
            {
                $match: {
                    _id: user._id,
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

export const cupdateProfile = async (req, res) => {
    try {
        const { first_name, last_name, country_code, mobile, about, country } =
            req.body;

        const user = req.user;

        const profilePix = await photoUploader(req, "profile_photo", `profile`);

        const seller = await UsersModel.findOne({
            _id: user._id,
        });

        await UsersModel.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                first_name: first_name,
                last_name: last_name,
                country_code: country_code,
                mobile: mobile,
                about: about,
                country: country,
                photo: profilePix === false ? seller.photo : profilePix,
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

export const addFavourite = async (req, res) => {
    try {
        const { seller_id } = req.body;

        const user = req.user;

        if (!seller_id) {
            return invalidRequest(
                res,
                400,
                null,
                "seller_id field is required"
            );
        }

        const alreadyExist = await FavouritesModel.findOne({
            collector_id: user._id,
            seller_id: seller_id,
        });

        if (alreadyExist) {
            return invalidRequest(
                res,
                400,
                null,
                "seller already in your favourite list"
            );
        }

        await new FavouritesModel({
            collector_id: user._id,
            seller_id: seller_id,
        }).save();

        return successResponse(
            res,
            200,
            null,
            "seller added to your favourite list"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const getFavourite = async (req, res) => {
    try {
        const user = req.user;

        const fav = await FavouritesModel.aggregate([
            {
                $match: {
                    collector_id: user._id,
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
                                    $eq: ["$_id", "$$sid"],
                                },
                            },
                        },
                        {
                            $project: {
                                first_name: 1,
                                last_name: 1,
                                photo: 1,
                                email: 1,
                                country: 1,
                                country_code: 1,
                                mobile: 1,
                                iso_code: 1,
                            },
                        },
                    ],
                    as: "seller",
                },
            },
        ]);

        return successResponse(res, 200, fav, "favourite sellers list fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const removeFavourite = async (req, res) => {
    try {
        const { seller_id } = req.body;
        const user = req.user;

        if (!seller_id) {
            return invalidRequest(
                res,
                400,
                null,
                "seller_id field is required"
            );
        }

        await FavouritesModel.findOneAndDelete({
            collector_id: user._id,
            seller_id: seller_id,
        });

        return successResponse(
            res,
            200,
            null,
            "seller removed to your favourite list"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const chatList = async (req, res) => {
    try {
        const user = req.user;

        const myRooms = await RoomsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $or: [
                            {
                                $eq: [
                                    "$sender_id",
                                    {
                                        $toObjectId: user._id,
                                    },
                                ],
                            },
                            {
                                $eq: [
                                    "$receiver_id",
                                    {
                                        $toObjectId: user._id,
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { participants: ["$sender_id", "$receiver_id"] },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $ne: ["$_id", user._id],
                                        },
                                        {
                                            $in: ["$_id", "$$participants"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                first_name: 1,
                                last_name: 1,
                                email: 1,
                                photo: 1,
                                country_code: 1,
                                mobile: 1,
                                online: 1,
                            },
                        },
                    ],
                    as: "user_details",
                },
            },
            {
                //to count unread messages in a chat, from a sender
                $lookup: {
                    from: "messages",
                    let: {
                        rid: "$room_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$room_id", "$$rid"],
                                        },
                                        {
                                            $ne: [
                                                "$sender_id",
                                                {
                                                    $toObjectId: user._id,
                                                },
                                            ],
                                        },
                                        {
                                            $eq: ["$seen_status", false],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $count: "counts",
                        },
                    ],
                    as: "unread_msg",
                },
            },
            {
                $lookup: {
                    from: "messages",
                    let: {
                        rid: "$room_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$room_id", "$$rid"],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "msg",
                },
            },
            {
                $addFields: {
                    lastMessage: { $last: "$msg" },
                },
            },
            {
                $sort: {
                    "lastMessage.createdAt": -1,
                },
            },
        ]);

        return successResponse(res, 200, myRooms, "chat list fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const chatMessages = async (req, res) => {
    try {
        const user = req.user;
        const room_id = req.params.id;

        const myChats = await MessageModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$room_id", room_id],
                    },
                },
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
        ]);

        return successResponse(res, 200, myChats, "chat messages fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

/**
 *  SEARCH APIS
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const searchSellers = async (req, res) => {
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
                            approved: true,
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
                                {
                                    about: {
                                        $regex: search,
                                        $options: "i",
                                    },
                                },
                                // { email: { $regex: search, $options: "i" } },
                                { _id: search },
                            ],
                        },
                    ],
                },
            },
        ]);

        return successResponse(res, 200, sellersRes, "seller search result");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const searchItemsSellers = async (req, res) => {
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
                            country: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                        {
                            year: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                    ],
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
                                    0,
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
                $group: {
                    _id: "$seller_id",
                    item: {
                        $push: "$$ROOT",
                    },
                },
            },
            {
                $unwind: "$item",
            },
        ]);

        const sellerRes = await UsersModel.aggregate([
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
                                // {
                                //     country: {
                                //         $regex: search,
                                //         $options: "i",
                                //     },
                                // },
                                {
                                    about: {
                                        $regex: search,
                                        $options: "i",
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
            {
                $project: {
                    first_name: 1,
                    last_name: 1,
                    photo: 1,
                    email: 1,
                    country_code: 1,
                    mobile: 1,
                    about: 1,
                    delivery_options: 1,
                    iso_code: 1,
                    level: 1,
                    verify: 1,
                    approved: 1,
                },
            },
        ]);

        return successResponse(
            res,
            200,
            {
                items: itemsRes,
                seller: sellerRes,
            },
            "items and seller search result"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
        console.log(error);
    }
};

export const searchItems = async (req, res) => {
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
                                    $and: [
                                        {
                                            $eq: [
                                                "$_id",
                                                { $toObjectId: "$$sid" },
                                            ],
                                        },
                                        {
                                            $eq: ["$approved", true],
                                        },
                                    ],
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
                                    0,
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
                $group: {
                    _id: "$seller_id",
                    item: {
                        $push: "$$ROOT",
                    },
                },
            },
            {
                $unwind: "$item",
            },
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

export const countryList = async (req, res) => {
    try {
        const countries = await SellersModel.aggregate([
            {
                $match: {
                    role: "seller",
                },
            },
            {
                $group: {
                    _id: null,
                    countries: {
                        $addToSet: "$country",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    countries: 1,
                },
            },
            {
                $unwind: "$countries",
            },
            {
                $sort: {
                    countries: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    countries: {
                        $push: "$countries",
                    },
                },
            },
        ]);

        const resData = countries[0].countries;

        // const data = {
        //     data: resData,
        // };

        // const key = req.originalUrl || req.url;
        // cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "sellers country list");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const itemsCountryList = async (req, res) => {
    try {
        const countries = await ItemsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $ne: ["$name", ""],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    countries: {
                        $addToSet: "$country",
                    },
                },
            },
            {
                $unwind: "$countries",
            },
            {
                $project: {
                    _id: 0,
                    countries: 1,
                },
            },
            {
                $unwind: "$countries",
            },
            {
                $sort: {
                    countries: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    countro: {
                        $addToSet: "$countries",
                    },
                },
            },
            {
                $unwind: "$countro",
            },
            {
                $sort: {
                    countro: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    countries: {
                        $push: "$countro",
                    },
                },
            },
        ]);

        const resData = countries[0].countries;

        // const data = {
        //     data: resData,
        // };

        // const key = req.originalUrl || req.url;
        // cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "sellers country list");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const checkRoomExist = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.body;

        const room1 = `private-${sender_id}-${receiver_id}`;

        const room2 = `private-${receiver_id}-${sender_id}`;

        const hasRoom = await RoomsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $or: [
                            {
                                $eq: ["$room_id", room1],
                            },
                            {
                                $eq: ["$room_id", room2],
                            },
                        ],
                    },
                },
            },
        ]);

        if (hasRoom[0] && hasRoom.length > 0) {
            return successResponse(
                res,
                200,
                {
                    exist: true,
                    room: hasRoom,
                },
                "room does exist"
            );
        } else {
            return successResponse(
                res,
                200,
                {
                    exist: false,
                    room: hasRoom,
                },
                "no room found"
            );
        }
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const usefulInfos = async (req, res) => {
    try {
        const country = req.query.country || "everywhere";

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

export const infoCountryList = async (req, res) => {
    try {
        const countries = await InformationModels.aggregate([
            {
                $match: {
                    $expr: {
                        $ne: ["$title", ""],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    countries: {
                        $addToSet: "$country",
                    },
                },
            },
            {
                $unwind: "$countries",
            },
            {
                $project: {
                    _id: 0,
                    countries: 1,
                },
            },
            {
                $unwind: "$countries",
            },
            {
                $sort: {
                    countries: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    countro: {
                        $addToSet: "$countries",
                    },
                },
            },
            {
                $unwind: "$countro",
            },
            {
                $sort: {
                    countro: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    countries: {
                        $push: "$countro",
                    },
                },
            },
        ]);

        const resData = countries[0].countries;

        // const data = {
        //     data: resData,
        // };

        // const key = req.originalUrl || req.url;
        // cache.put(key, data, 30 * 60 * 1000);

        return successResponse(res, 200, resData, "info country list");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};
