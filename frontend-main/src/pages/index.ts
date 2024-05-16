import HomePage from "./Home";
import LogInPage from "./auth/LogIn";
import SellerRegisterPage from "./auth/SellerRegister";
import AllSellers from "./Allsellers";
import LINKS from "src/utilities/links";
import AllItems from "./AllItems";
import SellerPage from "./seller";
import ItemPage from "./Item";
import CollectorRegisterPage from "./auth/CollectorRegisterPage";
import SelectRegister from "./auth/SelectRegister";
import { Component } from "react";
import SellerProfile from "./sellerProfile";
import AddItemsPage from "./Additems";
import CollectorProfile from "./collectorProfile";
import EditProfilePage from "./EditProfile";
import VerifyUser from "./auth/VerifyUser";
import ForgotPassword from "./auth/ForgotPassword";
import EditCollection from "./EditCollection";
import CreateCollectionPage from "./CreateCollection";
import AllSellerItemsPublicPage from "./AllSellerItems/public";
import AllSellerItemsPrivatePage from "./AllSellerItems/private";
import ShowCollectionsPage from "./Collections/ShowCollections";
import SingleCollectionPublic from "./Collections/SingleCollectionPublic";
import SingleCollectionPrivatePage from "./Collections/SingleCollectionPrivate";
import AddToCollectionPage from "./Collections/AddToCollection";
import PrivateCollectionDisplayPage from "./Collections/PrivateCollectionDisplay";
import VerifyEmail from "./auth/VerifyEmail";
import ChatPage from "./Chat";
import ProtectedRoutes from "./auth/ProtectedRoutes";
import HiddenItems from "./HiddenItems";
import AdminDashBoardPage from "./Admin/AdminDash/Index";
import AdminSellerPage from "./Admin/AdminSeller";
import AdminLoginPage from "./Admin/Auth/AdminLogin";
import AdminCollectorsPage from "./Admin/Admincollectors";
import AdminItemsPage from "./Admin/AdminItems";
import ContactusPage from "./Contact";
import AdminEditSeller from "./Admin/Editeller";
import AdminContactusPage from "./Admin/AdminContactus";
import AdminContactmessages from "./Admin/Admincontactmessage";
import FeaturedPage from "./Featured";
import AdminInformation from "./Admin/AdminInformation";
import AddInformationText from "./Admin/AdminInformation/addinfromation";
import UsefulInfromationPage from "./UsefulInfo";
import ChangePasswordloggedin from "./changepassword";
import FavoritesPage from "./Favourites";
import AccountVisibility from "./Accountvisibility";
import DisclaimerPage from "./Disclaimer";
import BlockUserPage from "./Blockeuser/BlockUser";

export default {
  Auth: {
    Login: {
      Component: LogInPage,
    },
    Register: {
      Component: SellerRegisterPage,
    },
    CollectorRegister: {
      Component: CollectorRegisterPage,
    },
    Selectregister: {
      Component: SelectRegister,
    },
    VerifyOtp: {
      Component: VerifyUser,
    },
    Forgotpassword: {
      Component: ForgotPassword,
    },
    Verifyemail: {
      Component: VerifyEmail,
    },
    ProtectedRoute: {
      Component: ProtectedRoutes,
    },
  },
  Home: {
    Component: HomePage,
  },
  ChangePass: {
    Component: ChangePasswordloggedin,
  },
  Allsellers: {
    Component: AllSellers,
    path: LINKS.Allsellers,
  },
  Allitems: {
    Component: AllItems,
    path: LINKS.Allitems,
  },
  seller: {
    Component: SellerPage,
  },
  Item: {
    Component: ItemPage,
  },
  sellerProfile: {
    Component: SellerProfile,
  },
  AddItems: {
    Component: AddItemsPage,
  },
  CollectorProfile: {
    Component: CollectorProfile,
  },
  EditProfile: {
    Component: EditProfilePage,
  },
  EditCollection: {
    Component: EditCollection,
  },
  Createcollection: {
    Component: CreateCollectionPage,
  },
  SellerPublicAllItems: {
    Component: AllSellerItemsPublicPage,
  },
  SellerPrivateAllItems: {
    Component: AllSellerItemsPrivatePage,
  },
  ShowCollections: {
    Component: ShowCollectionsPage,
  },
  SinglecollectionPublic: {
    Component: SingleCollectionPublic,
  },
  SingleCollectionPrivate: {
    Component: SingleCollectionPrivatePage,
  },
  PrivateCollectionDisPlay: {
    Component: PrivateCollectionDisplayPage,
  },
  Addtocollection: {
    Component: AddToCollectionPage,
  },
  Chatpage: {
    Component: ChatPage,
  },
  HiddenItems: {
    Component: HiddenItems,
  },
  Favourites: {
    Component: FavoritesPage,
  },
  Contactus: {
    Component: ContactusPage,
  },
  Usefulinfo: {
    Component: UsefulInfromationPage,
  },
  Featured: {
    Component: FeaturedPage,
  },
  Accountvisibility: {
    Component: AccountVisibility,
  },
  DisClaimer: {
    Component: DisclaimerPage,
  },
  Blockuser: {
    Component: BlockUserPage,
  },
  AdminAuth: {
    AdminLogin: {
      Component: AdminLoginPage,
    },
  },
  AdminDash: {
    Component: AdminDashBoardPage,
  },
  AdminSeller: {
    Component: AdminSellerPage,
  },
  AdminCollector: {
    Component: AdminCollectorsPage,
  },
  AdminItems: {
    Component: AdminItemsPage,
  },
  AdmineditSeller: {
    Component: AdminEditSeller,
  },
  AdminContactus: {
    Component: AdminContactusPage,
  },
  AdminContactmessage: {
    Component: AdminContactmessages,
  },
  AdminInformation: {
    Component: AdminInformation,
  },
  AdminInformationtext: {
    Component: AddInformationText,
  },
};
