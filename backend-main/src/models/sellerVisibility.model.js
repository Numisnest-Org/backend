import mongoose from "mongoose";

const sellerVisibilityModel = mongoose.Schema(
    {
        seller_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
        featured: {
            type: Boolean,
            default: true,
        },
        colleing: {
            type: Boolean,
            default: true,
        },
        details: {
            type: Boolean,
            default: true,
        },
        profile: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("seller_vis", sellerVisibilityModel);
