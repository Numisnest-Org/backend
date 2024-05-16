export interface Seller {
  flag: string;
  img: string;
  name: string;
  selling: string;
}
export interface item {
  flag: string;
  img: string;
  name: string;
  itemName: string;
  dateCreated: string;
  amount: string;
}
type userType = "seller" | "collector";
interface AdminloginDetails {
  last_login: string;
  ip_address:string
}
export interface ContextDataType {
  token: string | null;
  user: any;
  userType: userType | null;
  forgotEmail: string | null;
  pin: string | null;
  availableLocation: string[] | null;
  onlineUsers: OnlineType[] | null;
  navigateToUrl: string;
  adminloginDetails: AdminloginDetails | null;
  Messageid: string;
  addItemsval:null
}
export interface OnlineType {
  online:boolean;
  userid:string
}

export interface SellerType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile: string;
  role: string;
  delivery_option: string;
  country: string;
  auth_code: number;
  available: boolean;
  level: string;
  verify: boolean;
  approved: boolean;
  suspended: boolean;
  __v: number;
  photo:Photo;
  iso_code: string;
  about:string;
  pinned?:boolean
}

interface SellerInfo {
  _id: string;
  first_name: string;
  last_name: string;
}
export interface Photo {
  secure_url: string;
  public_id: string;
}

export interface ItemType {
  _id: string;
  seller_id: string;
  name: string;
  description: string;
  title:string;
  country: string;
  photos: Photo[];
  photo1: string;
  photo2?: string;
  photo3?: string;
  video?: string;
  currency: string;
  price: number;
  category: string;
  available: boolean;
  __v: number;
  iso_code: string;
  createdAt: string;
  updatedAt: string;
  seller_info: SellerInfo[];
  convertedPrice: number;
  convertedCurrency: string;
}
export interface HomeItemType {
  item: ItemType;
  _id: string;
}
export interface FormValueRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  cpassword: string;
  country_code?: string;
  mobile: string;
  about: string;
  delivery_option: string;
  country: string;
}
export interface ContactusFormType {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message:string
}

export interface SellerProfileType {
  about?: string;
  approved: boolean;
  available: boolean;
  country: string;
  country_code: string;
  createdAt: Date;
  delivery_option?: string;
  email: string;
  first_name: string;
  iso_code: string;
  last_name: string;
  level: string;
  mobile: string;
  photo: Photo;
  role: string;
  suspended: boolean;
  verify: boolean;
  _id: string;
  details?:string;
}

export interface SingleSeller {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile: string;
  role: string;
  about: string;
  delivery_option: string;
  country: string;
  auth_code: number;
  available: boolean;
  level: string;
  verify: boolean;
  approved: boolean;
  suspended: boolean;
  __v: number;
  photo: Photo;
  iso_code: string;
  createdAt: Date;
  details :string;
  seller_featured_items: SingleSellerFeaturedItem[];
}

export interface SingleSellerFeaturedItem {
  _id: string;
  name: string;
  description: string;
  photo1: string;
  price: number;
  photos: Photo[];
}

export interface SellerItemType {
  _id: string;
  seller_id: string;
  name: string;
  description: string;
  country: string;
  iso_code: string;
   photos: Photo[];
  photo1: string;
  photo2: string;
  photo3: string;
  video: string;
  currency: string;
  price: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface singleSellerWOFeatured {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile: string;
  role: string;
  about: string;
  delivery_option: string;
  country: string;
  auth_code: number;
  available: boolean;
  level: string;
  verify: boolean;
  approved: boolean;
  suspended: boolean;
  __v: number;
  photo: Photo;
  iso_code: string;
  createdAt: string;
}

export interface SingleItemType {
  _id: string;
  seller_id: string;
  name: string;
  description: any;
  country: string[];
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  photo5: string;
  photos: Photo[];
  video: string;
  currency: string;
  price: number;
  category: string[];
  available: boolean;
  iso_code: string;
  createdAt: string;
  updatedAt: string;
  convertedPrice: number;
  convertedCurrency: string;
  seller_info: singleSellerWOFeatured[];
  similar_items: Partial<ItemType>[];
  firstPhoto?: Photo;
  year?: any;
  pinned?:boolean
}

export interface CollectionType {
  _id: string;
  seller_id: string;
  name: string;
  items_id: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  hidden:boolean;
  coll_list: Partial<SingleItemType>[];
}
export interface GroupItems {
  _id: boolean;
  available: SingleItemType[];
}
export interface CollectorFav {
  _id: string;
  collector_id: string;
  seller_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  seller: Partial<SingleSeller>[];
}

export interface MessagesList {
  _id: string;
  room_id: string;
  sender_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  receiver_id: string;
  user_details: UserDetails[];
  unread_msg: UnreadMessage[];
}

interface UserDetails {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile: string;
  photo: Photo;
  online:boolean
}

interface UnreadMessage {
  counts: number;
}
export interface WebsiteOverview {
  
    tot_sellers: number;
    sellers_today: number;
    tot_collectors: number;
    collectors_today: number;
    tot_items: number;
    items_today: number;
    tot_messages: number;
    messages_today: number;
  
}
export interface Contactus {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OtherMessages {
  _id: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
export interface ContactUsMessage {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  other_messages: OtherMessages[];
}
export interface InformationType {
  _id: string;
  title: string;
  description: string|Node;
  country: string[];
  createdAt: string; 
  updatedAt: string;
  __v: number;
}
export interface AccountVisibilityType {
  collections: boolean;
  createdAt: string;
  details: boolean;
  featured: boolean;
  items: boolean;
  messaging: boolean;
  profile: boolean;
  seller_id: string;
  updatedAt: string;
  __v: number;
  _id: string;
}



interface BlockedUser {
  country_code: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  photo: {
    secure_url: string;
    public_id: string;
  };
  _id: string;
}

export interface BlockedDataType {
  block_list: string[];
  blocked_users: BlockedUser[];
  first_name: string;
  last_name: string;
  _id: string;
}