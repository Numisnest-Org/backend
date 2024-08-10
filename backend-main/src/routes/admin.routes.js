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
    delCollector,
    delItem,
    delSeller,
    disApproveCollector,
    logInfo,
    overView,
    pinItems,
    pinSellers,
    sellerProfile,
    topSeller,
    totalItemsByCateg,
    usefulInfo,
    usefulInfoAll,
    usefulInfoDelete,
    usefulInfoOne,
    usefulInfoUpdate,
} from "../controllers/admin.controllers.js";
import adminAuth from "../middlewares/admin.middleware.js";

const routerThree = express.Router();

routerThree.post("/signup", adminSignUp);
routerThree.post("/signin", adminSignIn);

//protected endpoint, admin
routerThree.use(adminAuth);
routerThree.get("/sellers", adminGetSellers);

routerThree.get("/search/sellers", adminSearchSellers);

routerThree.put("/seller/update/:id", adminUpdateSellerProfile);

routerThree.get("/collectors", adminGetCollectors);

routerThree.get("/search/collectors", adminSearchCollectors);

routerThree.put("/collector/approve/:id", approveCollector);

routerThree.put("/collector/disapprove/:id", disApproveCollector);

routerThree.delete("/seller/remove/:id", delSeller);

routerThree.delete("/collector/remove/:id", delCollector);

routerThree.put("/pinned/item/:id", pinItems);

routerThree.put("/pinned/seller/:id", pinSellers);

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

routerT

routerThree.get("/information/all", usefulInfoAll);

routerThree.get("/information/one/:id", usefulInfoOne);

export default routerThree;
