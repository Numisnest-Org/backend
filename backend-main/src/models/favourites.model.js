import mongoose from "mongoose";

const FavouriteSellerModel = mongoose.Schema(
    {
        coled: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("favourite_seller", FavouriteSellerModel);
