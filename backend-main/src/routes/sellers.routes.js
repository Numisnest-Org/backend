import express from "express";
import {
    addFeaturedItems,
    addItem,
    addItemToCollection,
    addToBlocklist,
    avection,
    fetchBlockedUsers,
    fetchCollections,
    freqSelctCountries,
    getProfile,
    getProfileVisibility,
    remFeaturedItem,
    remItemFromCollection,
    removeFromBlocklist,
    searchSellerItem,
    searchUser,
    sellerFavourites,
    sellerFeaturedItems,
    sellerHiddenItems,
    sellerItem,
    sellerItems,
    sellerSignUp,
    updateItem,
    updateManyy,
    updateProfile,
    updateProfileVisibility,
    uploadPhoto,
    uploadVideo,
} from "../controllers/sellers.controllers.js";
import sellerAuth from "../middlewares/sellers.middleware.js";

const routerTwo = express.Router();

routerTwo.post("/signup", sellerSignUp);

routerTwo.post("/changedb", updateManyy);

//protected endpoints
routerTwo.use(sellerAuth);

routerTwo.post("/upload-photo", uploadPhoto);

routerTwo.delete("/del-ophoto", deleteOnePhoto);

routerTwo.post("/upload-video", uploadVideo);

routerTwo.post("/add-item", addItem);

routerTwo.get("/frequently-sected-countries", freqSelcountries);

routerTwo.put("/update-item/:id", updateItem);

routerTwo.delete("/delete-item/:id", delItem);

routerTwo.get("/seller-items", sellerItems);

routerTwo.get("/seller-items/hidden", sellerHiddenItems);

routerTwo.get("/seller-ims/search", searchSrItem);

routerTwo.get("/seller-item/:id", sellerItem);

routerTwo.get("/profile/fetch", getProfile);

routerTwo.put("/vislity/edit", updatePleVisibility);

routerTwo.get("/visibility/get", getProfileVisibility);

routerTwo.put("/profile/update", updateProfile);

routerTwo.put("/seller-pass/change", changePassword);

routerTwo.post("/available/on", availableOn);

routerTwo.post("/available/off", availableOff);

routerTwo.get("/favourites", sellerFarites);

//chat pending
routerTwo.get("/chat/list", chatList);

routerTwo.get("/blockedme/users", blockedMe);

routerTwo.get("/chat/messages/:id", chatMessages);

routerTwo.post("/collecon/create", createCollection);

routerTwo.put("/collection/edit/:id", editCollection);

routerTwo.get("/collection/fetch", fetchColtions);

routerTwo.post("/collection/add-item/:id", addItemToColion);

routerTwo.post("/collecon/rem-item/:id", remItemFromCction);

routerTwo.delete("/collection/drop/:id", deleteCollection);

routerTwo.put("/featured/add", addFeaturedItems);

routerTwo.delete("/featured/rem/:id", remturedItem);

routerTwo.get("/featured/fetch", sellerFeatuItems);

routerTwo.post("/block-list/search-user", searchUser); //search by name or email

routerTwo.post("/block-list/add/:id", addToBlocklist);

routerTwo.get("/block-list/get", fetchBlockedUsers);

routerTwo.delete("/block-list/reme/:id", removeFromBklist);

export default routerTwo;
