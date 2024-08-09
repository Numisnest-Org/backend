import cloudinary from "./cloudinary.js";

const photoUploader = async (req, fileHandle, unique) => {
    if (!req.files) return false;
    if (!req.files[fileHandle]) return false;

    let files = Array.isArray(req.files[fileHandle])
        ? req.files[fileHandle]
        : [req.files[fileHandle]];

    if (files?.length > 7) {
        return {
            status: 400,
            message: "you cannot add more than 7 photos",
        };
    }

    let cloudRes = [];

    for (let file of files) {
        const pixRes = new Promise(async (resolve, reject) => {
            
                    }
                }
            );
        });
        const res = await pixRes;
        cloudRes.push(res);
    }

    try {
        return cloudRes;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export default photoUploader;
