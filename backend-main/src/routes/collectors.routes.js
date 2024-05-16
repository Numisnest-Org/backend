import express from "express";
import {
    addFavourite,
    cgetProfile,
    chatList,
    chatMessages,
    checkRoomExist,
    collectorSignUp,
    contactUs,
    countryList,
    cupdateProfile,
    getFavourite,
    getItem,
    getItems,
    getItemsHome,
    getSeller,
    getSellers,
    infoCountryList,
    itemsCountryList,
    logOut,
    passwordChange,
    passwordChangeCode,
    pinnedItems,
    pinnedSeller,
    removeFavourite,
    searchItems,
    searchItemsSellers,
    searchSellerItem,
    searchSellers,
    sellerCollection,
    sellerCollections,
    sellerFeaturedItems,
    sellerItems,
    // sellerItemsCateg,
    signIn,
    usefulInfos,
    verifyEmail,
} from "../controllers/collectors.controllers.js";
import collectorAuth from "../middlewares/collectors.middleware.js";
// import sellerAuth from "../middlewares/sellers.middleware.js";
// import adminAuth from "../middlewares/admin.middleware.js";

const routerOne = express.Router();

routerOne.post("/collector/signup", collectorSignUp);

routerOne.post("/general/signin", signIn);

routerOne.post("/general/verify-email", verifyEmail);

routerOne.post("/general/password/getcode", passwordChangeCode);

routerOne.post("/general/password/change", passwordChange);

routerOne.get("/general/countries", countryList);

routerOne.get("/general/items/countries", itemsCountryList);

routerOne.get("/general/info/countries", infoCountryList);

routerOne.get("/general/info", usefulInfos);

routerOne.post("/general/contactus", contactUs);

routerOne.post("/general/check-room", checkRoomExist);

/**
 * BREAK
 */

routerOne.get("/collector/get-items", getItems);

routerOne.get("/collector/get-item/:id", getItem);

routerOne.get("/collector/get-sellers", getSellers);

routerOne.get("/collector/get-home-items", getItemsHome);

routerOne.get("/collector/search/selleranditems", searchItemsSellers);

routerOne.get("/collector/pinned/sellers", pinnedSeller);

routerOne.get("/collector/pinned/items", pinnedItems);

routerOne.get("/collector/get-seller/:id", getSeller);

routerOne.get("/collector/featured-items/:id", sellerFeaturedItems);

routerOne.get("/collector/seller-items/:id", sellerItems);

routerOne.get("/collector/seller-items/search/:id", searchSellerItem);

// routerOne.get("/collector/seller-items-categ/:id", sellerItemsCateg);

routerOne.get("/collector/seller-collections/:id", sellerCollections);

routerOne.get("/collector/seller-collection/:id", sellerCollection);

routerOne.get("/collector/search/sellers", searchSellers);

routerOne.get("/collector/search/items", searchItems);

//auth endpoint
// routerOne.post(
//     "/general/logout",
//     collectorAuth || sellerAuth || adminAuth,
//     logOut
// );

routerOne.use(collectorAuth);

routerOne.post("/collector/add-fav", addFavourite);

routerOne.get("/collector/get-fav", getFavourite);

routerOne.delete("/collector/rem-fav", removeFavourite);

routerOne.get("/collector/profile/fetch", cgetProfile);

routerOne.put("/collector/profile/update", cupdateProfile);

routerOne.get("/collector/chat/list", chatList);

routerOne.get("/collector/chat/messages/:id", chatMessages);

export default routerOne;
