import mongoose from "mongoose";

const UserModel = mongoose.Schema(
    {
        first_name: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
        },
        last_name:tring,
            trim: true,
            required: true,
        },
        mobile: {
            type: String,
            // uniq: true,
            trim: true,
            required: true,
        },
        role: {
            type: String,
            enum: ["collector", "seller", "admin"],
            required: true,
        },
        about: {
            type: String,
        },
        country: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
        },
        iso_code: {
            type: String,
        },
        auth_code: {
            type: Number,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        approved: 
            type: Boolean,
            default: false,
      login: {
            type: Date,
            default: undefined,
        },
        block_list: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

UserModel.index({ location: "2dsphere" });

export default mongoose.model("uses", UserModel);
