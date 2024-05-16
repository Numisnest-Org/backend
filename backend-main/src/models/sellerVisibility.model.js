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
        collections: {
            type: Boolean,
            default: true,
        },
        items: {
            type: Boolean,
            default: true,
        },
        messaging: {
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
