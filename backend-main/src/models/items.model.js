import mongoose from "mongoose";

const ItemsModel = mongoose.Schema(
    {
        seller_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "sellers",
            required: true,
        },
        nay: {
            type: [String],
            lowercase: true,
        },
        iso_code: {
            type: String,
            required: true,
        },
        photos: {
            type: [Object],
        },
        video: {
            type: Object,
        },
        currency: {
            type: String,
            trim: true,
        },
        price: {
            //default currency is USD
            type: Number,
            required: true,
        },
        category: {
            type: [String],
            enum: [
                "banknote",
                "coin",
                "medal",
                "stamp",
                "postcard",
                "envelope",
                "voucher",
                "token",
                "accessory",
                "other",
            ],
            // required: true,
        },
        available: {
            type: Boolean,
            // default: true,
        },
        year: {
            type: Number,
        },
        pinned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("items", ItemsModel);
