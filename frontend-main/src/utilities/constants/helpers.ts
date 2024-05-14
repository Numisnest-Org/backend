import admindash from "src/assets/Image/AdminIcons/dashicon.svg";
import admindashselected from "src/assets/Image/AdminIcons/dashiconselected.svg";
import adminreseller from "src/assets/Image/AdminIcons/Reseller.svg";
import adminresellerselected from "src/assets/Image/AdminIcons/Resellerselected.svg";
import admincollertor from "src/assets/Image/AdminIcons/collector.svg";
import admincollectorselected from "src/assets/Image/AdminIcons/collectorselected.svg";
import adminitems from "src/assets/Image/AdminIcons/items.svg";
import adminitemselected from "src/assets/Image/AdminIcons/itemsselected.svg";
import contactus from "src/assets/Image/AdminIcons/contactus.svg";
import contactusselected from "src/assets/Image/AdminIcons/contactusSelected.svg";
import _ from "lodash";
import infromation from "src/assets/Image/AdminIcons/Information.svg"
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import infomationselected from "src/assets/Image/AdminIcons/infoicon.svg"
import InfromationCard from "src/components/AdminComponents/AdminCards/infromationCard";
export const emptyStr = "______";


export const textFromat = (data: string|undefined) =>
  data == undefined ? emptyStr : data;

export const maxWidth = "13rem";
export const minWidth = "6rem";

export const sidebarItems = [
  {
    name: "Dashboard",
    selectedIcon: admindashselected,
    icon: admindash,
    path: "admindashboard",
  },
  {
    name: "Seller",
    selectedIcon: adminresellerselected,
    icon: adminreseller,
    path: "adminseller",
  },
  {
    name: "Collector",
    selectedIcon: admincollectorselected,
    icon: admincollertor,
    path: "admincollector",
  },
  {
    name: "Items",
    selectedIcon: adminitemselected,
    icon: adminitems,
    path: "adminitems",
  },
  {
    name: "Contact Us",
    selectedIcon: contactusselected,
    icon: contactus,
    path: "admincontactus/table",
  },
  {
    name: "Information",
    selectedIcon: infromation,
    icon: infomationselected,
    path: "admininformation",
  },
];

 export const getCurrencyByCountry = (availableCountries: any, countriesList: any) => {
   const currencies: any = [];

   availableCountries?.forEach((availableCountry: any) => {
     const country = countriesList.find(
       (c: any) => c.name === _.startCase(availableCountry)
     );

     if (country) {
       currencies.push(country.currency);
     }
   });

   return currencies;
 };

 export const numberWithCommas = (number:number) => {
   return number?.toLocaleString("en-US");
 };
interface Category {
  val: string;
  label: string;
}
 export const calculateChartData = (data: any[], categories: Category[]) => {
   return categories.map((category) => {
     const found: any = data.find((cati) => cati._id === category.val);
     return found?.categ_items.length || 0;
   });
 };

 export const getyearList = ()=>{
  const yearList = []
  const currentYear = new Date().getFullYear();
  for (let year = 1500; year <= currentYear; year++) {
    yearList.push(year)
  }
  return yearList.reverse()
 }