import mongoose from "mongoose";

const ContactUsModel = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
       
            type: String,
            // required: true,
        },
        meage: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("contact_us", ContactUsModel);
