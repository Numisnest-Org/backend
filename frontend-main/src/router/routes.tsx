import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Pages from "../pages";
import pages from "../pages";
import AdminWrapper from "src/components/AdminComponents/Wrapper/AdminWrapper";
import AuthWrapper from "src/components/AdminComponents/Wrapper/AuthWrapper";
import AdminLoginPage from "src/pages/Admin/Auth/AdminLogin";
import AdminroueteWrapper from "src/pages/Admin/AdminroueteWrapper";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={"/auth"}>
        <Route path={"login"} element={<Pages.Auth.Login.Component />} />
        <Route
          path={"selectregister"}
          element={<Pages.Auth.Selectregister.Component />}
        />
        <Route
          path={"registerseller"}
          element={<Pages.Auth.Register.Component />}
        />
        <Route
          path={"registercollector"}
          element={<Pages.Auth.CollectorRegister.Component />}
        />
        <Route
          path={"verify-otp/:email"}
          element={<Pages.Auth.VerifyOtp.Component />}
        />
        <Route
          path={"verify-email/:email"}
          element={<Pages.Auth.Verifyemail.Component />}
        />
        <Route
          path={"forgot-password"}
          element={<Pages.Auth.Forgotpassword.Component />}
        />
      </Route>

      <Route path={"/"}>
        <Route index element={<Pages.Home.Component />} />
        <Route
          path={pages.Allsellers.path}
          element={<Pages.Allsellers.Component />}
        />
        <Route path="seller/:id" element={<Pages.seller.Component />} />
        <Route path="item/:id" element={<Pages.Item.Component />} />
        <Route
          path="showcollectionpage/:id/:firstname"
          element={<Pages.ShowCollections.Component />}
        />
        <Route
          path="singleCollection/:id"
          element={<Pages.SinglecollectionPublic.Component />}
        />
        <Route
          path="allpublicselleritems/:id"
          element={<Pages.SellerPublicAllItems.Component />}
        />
        <Route
          path={pages.Allitems.path}
          element={<Pages.Allitems.Component />}
        />
        <Route path="contactus" element={<Pages.Contactus.Component />} />

        <Route path="usefulinfo" element={<Pages.Usefulinfo.Component />} />
        <Route path="disclaimer" element={<Pages.DisClaimer.Component />} />

        <Route element={<Pages.Auth.ProtectedRoute.Component />}>
          <Route path="changepass" element={<Pages.ChangePass.Component />} />
          <Route path="favourites" element={<Pages.Favourites.Component />} />
          <Route
            path="accountvisibility"
            element={<Pages.Accountvisibility.Component />}
          />
          <Route
            path="block"
            element={<Pages.Blockuser.Component />}
          />

          <Route path="seller">
            <Route path="profile" element={<Pages.sellerProfile.Component />} />
            <Route path="additems" element={<Pages.AddItems.Component />} />
            <Route
              path="editcollection"
              element={<Pages.EditCollection.Component />}
            />
            <Route path="featured" element={<Pages.Featured.Component />} />
            <Route
              path="createcollection"
              element={<Pages.Createcollection.Component />}
            />
            <Route
              path="allprivateselleritems"
              element={<Pages.SellerPrivateAllItems.Component />}
            />
            <Route path="hidden" element={<Pages.HiddenItems.Component />} />
            <Route
              path="singlecollectionprivate/:id"
              element={<Pages.SingleCollectionPrivate.Component />}
            >
              <Route
                path="display"
                element={<Pages.PrivateCollectionDisPlay.Component />}
              />
              <Route path="add" element={<Pages.Addtocollection.Component />} />
            </Route>
          </Route>
          <Route path="chat" element={<Pages.Chatpage.Component />}></Route>
          <Route path="collector">
            <Route
              path="profile"
              element={<Pages.CollectorProfile.Component />}
            />
          </Route>
          <Route
            path="edit-profile"
            element={<Pages.EditProfile.Component />}
          />
        </Route>
        <Route path="adminauth" element={<AuthWrapper />}>
          <Route
            path="login"
            element={<Pages.AdminAuth.AdminLogin.Component />}
          />
        </Route>
        <Route element={<AdminroueteWrapper />}>
          <Route element={<AdminWrapper />}>
            <Route
              path="admindashboard"
              element={<Pages.AdminDash.Component />}
            ></Route>
            <Route
              path="adminseller"
              element={<Pages.AdminSeller.Component />}
            />
            <Route
              path="admincollector"
              element={<Pages.AdminCollector.Component />}
            />
            <Route path="adminitems" element={<Pages.AdminItems.Component />} />
            <Route
              path="admineditSeller"
              element={<Pages.AdmineditSeller.Component />}
            />
            <Route path="admincontactus">
              <Route
                path="table"
                element={<Pages.AdminContactus.Component />}
              />
              <Route
                path="admincontactmessage/:id"
                element={<Pages.AdminContactmessage.Component />}
              />
            </Route>
            <Route
              path="admininformation"
              element={<Pages.AdminInformation.Component />}
            />
            <Route
              path="admininformation/text"
              element={<Pages.AdminInformationtext.Component />}
            />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

export const Router = () => {
  return <RouterProvider router={router} />;
};
