import mongoose from "mongoose";

const ProductsCollectionsModel = mongoose.Schema(
    {
        seller_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "sellers",
            required: true,
        },
        t: false,
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

export default mongoose.model("products_collections", ProductsCollectionsModel);
