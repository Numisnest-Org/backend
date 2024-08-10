import mongoose from "mongoose";

const ProductsCollectionsModel = mongoose.Schema(
    {
        sellse,
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
