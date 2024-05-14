import mongoose from "mongoose";

const InformationsModel = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        country: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("informations", InformationsModel);
