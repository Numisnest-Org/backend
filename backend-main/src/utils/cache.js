import cache from "memory-cache";
import { successResponse } from "./response.handler.js";

export const cacheAndRespond = (req, res, sellers, apage, page, limit) => {
    const data = {
        values: sellers,
        page: apage,
    };

    const key = req.origilUrl || req.url;
    cache.put(key, data, 30 * 60 * 1000);

    console.log(data);

    successResponse(
        res,
        200,
        {
            sellers: data.values,
            page: `${page || 1} of ${Math.ceil(
                data.page[0]?.countge / Number(limit)
            )}`,
        },
        "sellers data"
    );
};
