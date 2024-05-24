import ItemsModel from "../models/items.model.js";
import SellersModel from "../models/sellers.model.js";
import UsersModel from "../models/users.model.js";
import { authCode } from "../utils/authCode.js";
import { Decrypt, Encrypt } from "../utils/bcrypt.js";
import Email from "../utils/emailer.js";
import photoUploader from "../utils/photoUploader.js";
import videoUploader from "../utils/videoUploader.js";
import {
    successResponse,
    failedResponse,
    invalidRequest,
    serverError,
} from "../utils/response.handler.js";
import { countryToAlpha2, countryToAlpha3 } from "country-to-iso";
import FavouritesModel from "../models/favourites.model.js";
import RoomsModel from "../models/rooms.model.js";
import MessageModel from "../models/message.model.js";
import CollectionsModels from "../models/collections.models.js";
import { userInfo } from "../utils/userInfo.js";
import axios from "axios";
import FeaturedModels from "../models/featured.models.js";
import { delMedia } from "../utils/deleteMedia.js";
import mongoose from "mongoose";
import SellerVisibilityModel from "../models/sellerVisibility.model.js";

export const sellerSignUp = async (req, res) => {
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
            delivery_option,
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
            // !delivery_option ||
            !country
        ) {
            return invalidRequest(res, 400, req.body, "all input are required");
        }

        const userExist = await SellersModel.findOne({
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

        const newUser = new SellersModel({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: await Encrypt(password),
            country_code: country_code,
            mobile: mobile,
            about: about,
            // delivery_option: delivery_option,
            country: country.toLowerCase(),
            iso_code: iso,
            role: "seller",
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

        return successResponse(res, 201, null, "New User Created successfully");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

/**
 * Auth Endpoints
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        const userDtls = await SellersModel.aggregate([
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

export const updateProfileVisibility = async (req, res) => {
    try {
        const { featured, collections, items, messaging, details, profile } =
            req.body;

        const user = req.user;

        await SellerVisibilityModel.findOneAndUpdate(
            {
                seller_id: user._id,
            },
            {
                featured: featured,
                collections: collections,
                items: items,
                messaging: messaging,
                details: details,
                profile: profile,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "Profile Visibility Updated");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const getProfileVisibility = async (req, res) => {
    try {
        const user = req.user;

        const visible = await SellerVisibilityModel.aggregate([
            {
                $match: {
                    seller_id: user._id,
                },
            },
        ]);

        return successResponse(res, 200, visible, "Profile Visibility Fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            country_code,
            mobile,
            about,
            delivery_option,
            country,
            details
        } = req.body;

        const user = req.user;

        const profilePix = await photoUploader(req, "profile_photo", `profile`);

        const seller = await SellersModel.findOne({
            _id: user._id,
        });

        await SellersModel.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                first_name: first_name,
                last_name: last_name,
                country_code: country_code,
                mobile: mobile,
                about: about,
                delivery_option: delivery_option,
                country: country?.toLowerCase(),
                photo: profilePix === false ? seller.photo : profilePix[0],
                profile_description: details
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

export const changePassword = async (req, res) => {
    try {
        const user = req.user;

        const { old_password, password, cpassword } = req.body;

        const userExist = await UsersModel.findOne({
            _id: user._id,
            email: user.email,
            role: "seller",
        });

        if (!userExist) {
            return failedResponse(
                res,
                400,
                null,
                "Oops, something went wrong: User does not exist"
            );
        }

        const passVerify = await Decrypt(old_password, userExist.password);

        if (!passVerify) {
            return invalidRequest(res, 400, null, "incorrect old password");
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

        await UsersModel.findOneAndUpdate(
            {
                _id: user._id,
                role: "seller",
            },
            {
                password: await Encrypt(password),
            }
        );

        return successResponse(res, 200, null, "password changed successfully");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const availableOn = async (req, res) => {
    try {
        const user = req.user;
        await SellersModel.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                available: true,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "availability turned on");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const availableOff = async (req, res) => {
    try {
        const user = req.user;
        await SellersModel.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                available: false,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "availability turned off");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const uploadPhoto = async (req, res) => {
    try {
        const user = req.user;

        const photo = await photoUploader(req, "photos", `item`);

        return successResponse(res, 200, photo, "photo uploaded");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const deleteOnePhoto = async (req, res) => {
    try {
        const user = req.user;
        const cloud_id = req.query.cloud_id;

        const photo = await delMedia(cloud_id);

        return successResponse(res, 200, photo, "photo removed");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const uploadVideo = async (req, res) => {
    try {
        const user = req.user;

        const video = await videoUploader(req, "video", `item`);

        return successResponse(res, 200, video, "video uploaded");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const addItem = async (req, res) => {
    try {
        let {
            name,
            description,
            currency,
            price,
            category,
            country,
            available,
            photos,
            video,
            collection,
            year,
        } = req.body;

        const user = req.user;

        if (typeof photos !== "undefined" && photos !== "") {
            photos = JSON.parse(photos);
        }

        if (typeof video !== "undefined" && video !== "") {
            video = JSON.parse(video);
        }

        if (
            !name ||
            !description ||
            !currency ||
            !price ||
            !available ||
            !(photos && Array.isArray(photos) && photos.length > 0)
        ) {
            return invalidRequest(
                res,
                400,
                req.body,
                "input are required (name, description, currency, price, available, photos[{}])"
            );
        }

        const counto = country?.toString().split(",");

        const categs = category?.toString().split(",");

        if (counto?.length > 5) {
            return invalidRequest(
                res,
                400,
                null,
                "you cannot add more than 5 countries"
            );
        }

        let countr = [];

        if (counto) {
            for (let x of counto) {
                const lo = x.toLowerCase();
                countr.push(lo);
            }
        }

        if (categs?.length > 3) {
            return invalidRequest(
                res,
                400,
                null,
                "you cannot add more than 3 categories"
            );
        }

        if (photos?.length > 7) {
            return invalidRequest(
                res,
                400,
                null,
                "you cannot add more than 7 photos"
            );
        }

        const { data } = await axios(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency?.toLowerCase()}.json`
        );

        const xrate = data[currency.toLowerCase()]["usd"];
        // console.log(rate , "this is rate")

        // const xrate = Object.values(data);

        price = Number(xrate) * price;

        const item = await new ItemsModel({
            seller_id: user._id,
            name: name,
            description: description,
            currency: "USD",
            price: price,
            country: countr,
            iso_code: user?.iso_code,
            category: categs,
            photos: photos,
            video: video || "",
            available: available,
            year: Number(year),
        }).save();

        if (collection && collection !== "") {
            await CollectionsModels.findOneAndUpdate(
                {
                    _id: collection,
                    seller_id: user._id,
                },
                {
                    $push: {
                        items_id: item._id.toString(),
                    },
                }
                // {
                //     upsert: true,
                // }
            );
        }

        return successResponse(res, 201, null, "new item added by you");
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const freqSelctCountries = async (req, res) => {
    try {
        const user = req.user;

        const dateCal = new Date().getTime() - 1000 * 60 * 60 * 24 * 15;
        const dateLim = new Date(dateCal);

        const freqCountries = await ItemsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    "$seller_id",
                                    {
                                        $toObjectId: user._id,
                                    },
                                ],
                            },
                            {
                                $gte: ["$createdAt", dateLim],
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    country: 1,
                },
            },
            {
                $unwind: "$country",
            },
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 3,
            },
        ]);

        return successResponse(
            res,
            201,
            freqCountries,
            "frequently selected countries"
        );
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const updateManyy = async (req, res) => {
    try {
        // await UsersModel.updateMany({}, [
        //     {
        //         $set: {
        //             photo: { secure_url: "", public_id: "" },
        //         },
        //     },
        //     // {
        //     //     $unset: ["photo"],
        //     // },
        // ]);

        // await SellersModel.updateMany({}, [
        //     {
        //         $set: {
        //             block_list: [],
        //         },
        //     },
        // ]);

        return successResponse(res, 200, null, "doneeeee");
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const updateItem = async (req, res) => {
    try {
        let {
            name,
            description,
            currency,
            country,
            category,
            collection,
            price,
            available,
            photos,
            video,
            year,
        } = req.body;
        const user = req.user;

        const oldVal = await ItemsModel.findOne({
            _id: req.params.id,
            seller_id: user._id,
        });

        if (typeof photos !== "undefined" && photos !== "") {
            photos = JSON.parse(photos);
        }

        if (typeof video !== "undefined" && video !== "") {
            video = JSON.parse(video);
        }

        const counto = country?.toString().split(",");

        const categs = category?.toString().split(",");

        if (counto && counto?.length > 5) {
            return invalidRequest(
                res,
                400,
                null,
                "you cannot add more than 5 countries"
            );
        }

        if (photos && photos?.length > 7) {
            return invalidRequest(
                res,
                400,
                null,
                "you cannot add more than 7 photos"
            );
        }

        let countr = [];

        if (counto) {
            for (let x of counto) {
                const lo = x.toLowerCase();
                countr.push(lo);
            }
        }

        if (categs && categs?.length > 3) {
            return invalidRequest(
                res,
                400,
                null,
                "you cannot add more than 3 categories"
            );
        }

        if (price && !currency) {
            return invalidRequest(
                res,
                400,
                null,
                "you need to specify the currency you are adding"
            );
        }

        if (price) {
            const { data } = await axios(
                `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency?.toLowerCase()}.json`
            );

            const xrate = data[currency.toLowerCase()]["usd"];

            price = Number(xrate) * price;
        }

        if (collection && collection !== "") {
            await CollectionsModels.findOneAndUpdate(
                {
                    _id: collection,
                    seller_id: user._id,
                },
                {
                    $push: {
                        items_id: oldVal._id.toString(),
                    },
                }
                // {
                //     upsert: true,
                // }
            );
        }

        await ItemsModel.findOneAndUpdate(
            {
                _id: req.params.id,
                seller_id: user._id,
            },
            {
                name: name || oldVal.name,
                description: description || oldVal.description,
                currency: "USD",
                price: price || oldVal.price,
                country: countr || oldVal.countr,
                category: categs || oldVal.categ,
                photos: photos || oldVal.photos,
                video: video || oldVal?.video,
                available: available || oldVal.available,
                year: Number(year) || oldVal.year,
            }
        );

        return successResponse(
            res,
            201,
            null,
            `You updated one of your product ${oldVal?._id}`
        );
    } catch (error) {
        console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const delItem = async (req, res) => {
    try {
        const user = req.user;
        const itemid = req.params.id;

        const item = await ItemsModel.findOne({
            _id: itemid,
            seller_id: user._id,
        });

        let photos = item?.photos;

        if (item?.photos && item?.photos !== "") {
            for (let x of photos) {
                await delMedia(x.public_id);
            }
        }

        if (item?.video && item?.video !== "") {
            await delMedia(item.video.public_id);
        }

        await ItemsModel.findOneAndDelete({
            _id: itemid,
            seller_id: user._id,
        });

        return successResponse(res, 200, null, "item deleted");
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

        // const xrate = Object.values(data);
        const xrate = data[currency.toLowerCase()][pcurrency.toLowerCase()];

        return Number(xrate) * price;
    } catch (error) {
        console.log(error.message);
    }
}

export const sellerItems = async (req, res) => {
    try {
        const seller = req.user._id;

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
            uinfo?.currency?.toLowerCase() ||
            req?.query?.currency?.toLowerCase();

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
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const sellerHiddenItems = async (req, res) => {
    try {
        const seller = req.user._id;

        const items = await ItemsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ["$available", false],
                            },
                            {
                                $eq: [
                                    "$seller_id",
                                    {
                                        $toObjectId: seller,
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        ]);

        return successResponse(res, 200, items, "seller hidden items fetched");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const searchSellerItem = async (req, res) => {
    try {
        const search = req.query.search;

        const seller_id = req.user._id;

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

export const sellerItem = async (req, res) => {
    try {
        const user = req.user;
        const param = req.params;
        // const userItem = await ItemsModel.findOne({
        //     seller_id: user._id,
        //     _id: req.params.id,
        // });

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo, ip);

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        const userItem = await ItemsModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    "$seller_id",
                                    {
                                        $toObjectId: user._id,
                                    },
                                ],
                            },
                            {
                                $eq: [
                                    "$_id",
                                    {
                                        $toObjectId: param.id,
                                    },
                                ],
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
            // {
            //     $lookup: {
            //         from: "products_collections",
            //         let: {
            //             iid: "$_id",
            //         },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: {
            //                         $in: [req.params.id, "$items_id"],
            //                     },
            //                 },
            //             },
            //             {
            //                 $project: {
            //                     __v: 0,
            //                 },
            //             },
            //         ],
            //         as: "items collections",
            //     },
            // },
        ]);

        return successResponse(res, 200, userItem, "seller item");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const sellerFavourites = async (req, res) => {
    try {
        const user = req.user;
        const userItem = await FavouritesModel.aggregate([
            {
                $match: {
                    seller_id: user._id,
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: {
                        sid: "$collector_id",
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

        return successResponse(res, 200, userItem, "seller details");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const chatList = async (req, res) => {
    try {
        const user = req.user;

        const myBL = await UsersModel.findOne({ _id: user._id });

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
                    let: {
                        participants: ["$sender_id", "$receiver_id"],
                    },
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
                                        {
                                            $not: {
                                                $in: [
                                                    {
                                                        $toString: "$_id",
                                                    },
                                                    myBL.block_list,
                                                ],
                                            },
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
                $match: {
                    user_details: { $exists: true, $ne: [] },
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

export const blockedMe = async (req, res) => {
    try {
        const usersThatBlockedMe = await UsersModel.aggregate([
            {
                $match: {
                    $expr: {
                        $in: [
                            {
                                $toString: user._id,
                            },
                            "$block_list",
                        ],
                    },
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
                },
            },
        ]);

        return successResponse(
            res,
            200,
            usersThatBlockedMe,
            "users you cannot reached"
        );
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

export const createCollection = async (req, res) => {
    try {
        const user = req.user;
        const { name, item_id_arr } = req.body;

        if (!name) {
            return invalidRequest(
                res,
                400,
                null,
                "name and item_id is required"
            );
        }

        // const checkItem = await ItemsModel.findOne({
        //     _id: item_id,
        //     seller_id: user._id,
        // });

        // if (!checkItem) {
        //     return invalidRequest(res, 400, null, "item not found");
        // }

        const newCollection = new CollectionsModels({
            seller_id: user._id,
            name: name,
            items_id: [],
        });

        if (item_id_arr) {
            await newCollection.items_id.push(...item_id_arr);
        }

        await newCollection.save();

        return successResponse(res, 200, null, "collection created");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const editCollection = async (req, res) => {
    try {
        const user = req.user;
        const colid = req.params.id;

        const hidden = req.body.hidden;

        await CollectionsModels.findOneAndUpdate(
            {
                _id: colid,
                seller_id: user.id,
            },
            {
                hidden: hidden,
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "collection edited");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const fetchCollections = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const collection = await CollectionsModels.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$seller_id",
                            {
                                $toObjectId: sellerId,
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

export const addItemToCollection = async (req, res) => {
    try {
        const user = req.user;
        const collection_id = req.params.id;
        const { item_id_arr } = req.body;

        if (!item_id_arr || !collection_id) {
            return invalidRequest(
                res,
                400,
                null,
                "collection_id and item_id is required"
            );
        }

        if (item_id_arr.length <= 0) {
            return invalidRequest(
                res,
                400,
                null,
                "you cannot add empty item_id array"
            );
        }

        for (let item_id of item_id_arr) {
            // const checkItem = await ItemsModel.findOne({
            //     _id: item_id,
            //     seller_id: user._id,
            // });

            // if (!checkItem) {
            //     return invalidRequest(
            //         res,
            //         400,
            //         null,
            //         "something went wrong, item not found"
            //     );
            // }

            await CollectionsModels.findOneAndUpdate(
                {
                    _id: collection_id,
                    seller_id: user._id,
                },
                {
                    $push: {
                        items_id: item_id,
                    },
                }
                // {
                //     upsert: true,
                // }
            );
        }

        return successResponse(res, 200, null, "item added to collection");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const remItemFromCollection = async (req, res) => {
    try {
        const user = req.user;
        const collection_id = req.params.id;
        const { item_id } = req.body;

        if (!item_id || !collection_id) {
            return invalidRequest(
                res,
                400,
                null,
                "collection_id and item_id is required"
            );
        }

        const checkItem = await ItemsModel.findOne({
            _id: item_id,
            seller_id: user._id,
        });

        if (!checkItem) {
            return invalidRequest(res, 400, null, "item not found");
        }

        await CollectionsModels.findOneAndUpdate(
            {
                _id: collection_id,
                seller_id: user._id,
            },
            {
                $pull: {
                    items_id: item_id,
                },
            },
            {
                new: true,
            }
        );

        return successResponse(res, 200, null, "item removed to collection");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const user = req.user;
        const colid = req.params.id;

        await CollectionsModels.findOneAndDelete({
            _id: colid,
            seller_id: user.id,
        });

        return successResponse(res, 200, null, "collection deleted");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const addFeaturedItems = async (req, res) => {
    try {
        const user = req.user;

        const { items_id } = req.body;

        let featItems = await FeaturedModels.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$seller_id",
                            {
                                $toObjectId: user._id,
                            },
                        ],
                    },
                },
            },
        ]);

        featItems = featItems[0];

        if (items_id.length < 1) {
            return invalidRequest(res, 200, null, "items_id array is empty");
        }
        // console.log(featItems);

        if (!featItems) {
            const fItems = new FeaturedModels({
                seller_id: user._id,
            });

            const fetItems = await fItems.save();

            if (items_id.length > 6) {
                return invalidRequest(
                    res,
                    400,
                    null,
                    "you cannot add more than 6 items"
                );
            }

            for (let item of items_id) {
                await FeaturedModels.findOneAndUpdate(
                    {
                        _id: fetItems._id,
                    },
                    {
                        $push: {
                            items_id: item,
                        },
                    },
                    {
                        upsert: true,
                    }
                );
            }

            return successResponse(res, 200, null, "featured item(s) added");
        } else if (featItems && featItems._id) {
            if (
                Number(featItems.items_id.length) < 6 &&
                Number(items_id.length) <= 6 - Number(featItems.items_id.length)
            ) {
                for (let item of items_id) {
                    await FeaturedModels.findOneAndUpdate(
                        {
                            _id: featItems._id,
                        },
                        {
                            $push: {
                                items_id: item,
                            },
                        },
                        {
                            upsert: true,
                        }
                    );
                }

                return successResponse(
                    res,
                    200,
                    null,
                    "featured item(s) added"
                );
            } else {
                return invalidRequest(
                    res,
                    400,
                    null,
                    "feature items list is full"
                );
            }
        }
    } catch (error) {
        // console.log(error);
        return serverError(res, 500, null, error.message);
    }
};

export const remFeaturedItem = async (req, res) => {
    try {
        const user = req.user;

        const item_id = req.params.id;

        if (!item_id) {
            return invalidRequest(res, 400, null, "item_id is required");
        }

        await FeaturedModels.findOneAndUpdate(
            {
                seller_id: user._id,
            },
            {
                $pull: {
                    items_id: item_id,
                },
            },
            {
                new: true,
            }
        );

        return successResponse(res, 200, null, "item removed to collection");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const sellerFeaturedItems = async (req, res) => {
    try {
        const user = req.user;

        const ip = req.ip || req.socket.remoteAddress;
        const uinfo = await userInfo(ip); //"212.113.115.165"
        // console.log(uinfo);

        const userPreferredCurrency = uinfo?.currency?.toLowerCase();

        const rate = await convertCurrency("usd", userPreferredCurrency, 1);

        const featItems = await FeaturedModels.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$seller_id",
                            {
                                $toObjectId: user._id,
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

export const searchUser = async (req, res) => {
    try {
        const search = req.query.search;

        const sellersRes = await UsersModel.aggregate([
            {
                $match: {
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
                        //     about: {
                        //         $regex: search,
                        //         $options: "i",
                        //     },
                        // },
                        {
                            email: {
                                $regex: search,
                                $options: "i",
                            },
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
                    iso_code: 1,
                },
            },
        ]);

        return successResponse(
            res,
            200,
            sellersRes,
            "user search result for block list"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const addToBlocklist = async (req, res) => {
    try {
        const id = req.params.id;

        const blockUser = await UsersModel.findOne({ _id: id });

        if (!blockUser) {
            return failedResponse(
                res,
                200,
                null,
                "something went wrong, user not found"
            );
        }

        const user = req.user;

        await UsersModel.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                $push: {
                    block_list: blockUser._id.toString(),
                },
            },
            {
                upsert: true,
            }
        );

        return successResponse(res, 200, null, "user added to your blocklist");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const removeFromBlocklist = async (req, res) => {
    try {
        const id = req.params.id;

        const blockUser = await UsersModel.findOne({ _id: id });

        if (!blockUser) {
            return failedResponse(
                res,
                200,
                null,
                "something went wrong, user not found"
            );
        }

        const user = req.user;

        await UsersModel.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                $pull: {
                    block_list: id.toString(),
                },
            },
            {
                new: true,
            }
        );

        return successResponse(
            res,
            200,
            null,
            "user removed from your blocklist"
        );
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};

export const fetchBlockedUsers = async (req, res) => {
    try {
        const user = req.user;

        const blockUsers = await UsersModel.aggregate([
            {
                $match: {
                    _id: user._id,
                },
            },
            {
                $project: {
                    first_name: 1,
                    last_name: 1,
                    block_list: 1,
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: {
                        bl: "$block_list",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        {
                                            $toString: "$_id",
                                        },
                                        "$$bl",
                                    ],
                                },
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
                            },
                        },
                    ],
                    as: "blocked_users",
                },
            },
        ]);

        return successResponse(res, 200, blockUsers, "your blocklist");
    } catch (error) {
        return serverError(res, 500, null, error.message);
    }
};
