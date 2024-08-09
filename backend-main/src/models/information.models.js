import mongoose from "mongoose";

const InformationsModel = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        descrtry: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("informions", InformationsModel);
