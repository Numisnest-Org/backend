import express from "express";
import {
    addFeaturedItems,
    addItem,
    addItemToCollection,
    addToBlocklist,
    availableOff,
    availableOn,
    blockedMe,
    changePassword,
    chatList,
    chatMessages,
    createCollection,
    delItem,
    deleteCollection,
    deleteOnePhoto,
    editCollection,
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

routerTwo.delete("/del-one-photo", deleteOnePhoto);

routerTwo.post("/upload-video", uploadVideo);

routerTwo.post("/add-item", addItem);

routerTwo.get("/frequently-selected-countries", freqSelctCountries);

routerTwo.put("/update-item/:id", updateItem);

routerTwo.delete("/delete-item/:id", delItem);

routerTwo.get("/seller-items", sellerItems);

routerTwo.get("/seller-items/hidden", sellerHiddenItems);

routerTwo.get("/seller-items/search", searchSellerItem);

routerTwo.get("/seller-item/:id", sellerItem);

routerTwo.get("/profile/fetch", getProfile);

routerTwo.put("/visibility/edit", updateProfileVisibility);

routerTwo.get("/visibility/get", getProfileVisibility);

routerTwo.put("/profile/update", updateProfile);

routerTwo.put("/seller-pass/change", changePassword);

routerTwo.post("/available/on", availableOn);

routerTwo.post("/available/off", availableOff);

routerTwo.get("/favourites", sellerFavourites);

//chat pending
routerTwo.get("/chat/list", chatList);

routerTwo.get("/blockedme/users", blockedMe);

routerTwo.get("/chat/messages/:id", chatMessages);

routerTwo.post("/collection/create", createCollection);

routerTwo.put("/collection/edit/:id", editCollection);

routerTwo.get("/collection/fetch", fetchCollections);

routerTwo.post("/collection/add-item/:id", addItemToCollection);

routerTwo.post("/collection/rem-item/:id", remItemFromCollection);

routerTwo.delete("/collection/drop/:id", deleteCollection);

routerTwo.put("/featured/add", addFeaturedItems);

routerTwo.delete("/featured/rem/:id", remFeaturedItem);

routerTwo.get("/featured/fetch", sellerFeaturedItems);

routerTwo.post("/block-list/search-user", searchUser); //search by name or email

routerTwo.post("/block-list/add/:id", addToBlocklist);

routerTwo.get("/block-list/get", fetchBlockedUsers);

routerTwo.delete("/block-list/remove/:id", removeFromBlocklist);

export default routerTwo;
