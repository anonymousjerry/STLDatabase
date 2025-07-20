interface Product {
  id: string;
  title: string;
  platform: string;
  category: string;
  subcategory: string;
  likes: number;
  downloads: number;
  views: number;
  tags: string[];
  thumbnailUrl: string;
  price: number;
}

// interface Model {
//   id: String;
//   title: String;
//   // description: String;
//   // sourceSite: SourceSite;
//   // sourceSiteId: String;
//   // category: Category;
//   // categoryId: String;
//   // subCategory: String;
//   // subCategoryId: String;
//   tags: String[];
//   likes: number;
//   // deleted: Boolean;
//   downloads: number;
//   // thumbnailUrl: String;
//   // sourceUrl: String;
//   imagesUrl: String;
//   // createdAt: DateTime;
//   // updatedAt: getDefaultAutoSelectFamilyAttemptTimeout;
// }

interface Model {
  id: string;
  title: string;
  tags: string[];
  likes: number;
  price: string;
  downloads: number;
  imageUrl: string;
}

interface SingleProductPageProps {
  params: {
    productSlug: string;
  };
}

type ProductInWishlist = {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
};

interface OtherImages {
  imageID: number;
  productID: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  password: string | null;
  role: string;
}

interface Order {
  id: string;
  adress: string;
  apartment: string;
  company: string;
  dateTime: string;
  email: string;
  lastname: string;
  name: string;
  phone: string;
  postalCode: string;
  status: "processing" | "canceled" | "delivered";
  city: string;
  country: string;
  orderNotice: string?;
  total: number;
}

interface SingleProductBtnProps {
  product: Product;
  quantityCount: number;
}


interface Category {
  id: string;
  name: string;
}

interface WishListItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}