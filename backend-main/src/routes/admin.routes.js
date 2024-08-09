import express from "express";
import {
    adminGetCollectors,
    adminGetItems,
    adminGetSellers,
    adminSearchCollectors,
    adminSearchItems,
    adminSearchSellers,
    adminSignIn,
    adminSignUp,
    adminUpdateSellerProfile,
    approveCollector,
    collectorProfile,
    contactUsMessage,
    contactUsMessages,
    delInfo,
    usefulInfoAll,
    usefulInfoDelete,
    usefulInfoOne,
    usefulInfoUpdate,
} from "../controllers/admin.conollers.js";
import adminAuth from "../middlewes/admin.middleware.js";

const routerThree = express.Router();

routerThree.post("/signup", adminSignUp);
routerThree.post("/signin", adminSignIn);

//protected endpoint, admin
routerThree.use(adminAuth);
routerThree.get("/sellers", adminGetSellers);

routerThree.get("/search/seers", adminSearchSellers);

routerThree.put("/seller/update/:id", adminUpdateSellerProfile);

routerThree.get("/collectors", adminGetCollectors);

routerThree.get("/search/clectors", adminSearchCollectors);

routerThree.put("/collector/approve/:id", approveCollector);

routerThree.put("/collector/disapprove/:id", disApprovllector);

routerThree.delete("/seller/remove/:id", delSeller);

routerThree.delete("/collector/rove/:id", delCollector);

routerThree.put("/pined/item/:id", pinItems);

routerThree.put("/pinned/seller/:id", pinSeers);

routerThree.get("/items", adminGetItems);

routerThree.get("/search/items", adminSearchItems);

routerThree.delete("/remove/item/:id", delItem);

routerThree.get("/seller/profile/:id", sellerProfile);

routerThree.get("/collector/profile/:id", collectorProfile);

/**
 * ADMIN DASHBOARD ENDPOINTS
 */

routerThree.get("/loginfo", logInfo);

routerThree.get("/overview", overView);

routerThree.get("/topsellers", topSeller);

routerThree.get("/itemspie", totalItemsByCateg);

routerThree.get("/contactus/messages", contactUsMessages);

routerThree.get("/contactus/message/:id", contactUsMessage);

/**
 * useful informations
 */
routerThree.post("/information/add", usefulInfo);

routerThree.put("/information/edit/:id", usefulInfoUpdate);

routerThree.delete("/information/del/:id", usefulInfoDelete);

routerThree.get("/information/all", usefulInfoAll);

routerThree.get("/information/one/:id", usefulInfoOne);

export default routerThree;
