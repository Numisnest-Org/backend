import mongoose from "mongoose";

const FeaturedProductsModel = mongoose.Schema(
    {
        seller_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "sellers",
            required: true,
        },
        items_id: {
            type: Array,
            ref: "items",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("featured_items", FeaturedProductsModel);
