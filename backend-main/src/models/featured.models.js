import mongoose from "mongoose";

const FeaturedProductsModel = mongoose.Schema(
    {
        seller_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "sellers",
            requd: {
            type: Array,
            ref: "items",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("featured_items", FeaturedProductsModel);
