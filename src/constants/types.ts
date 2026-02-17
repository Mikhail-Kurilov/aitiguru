export interface Product {
  id: number;
  title: string;
  description: string;
  brand: string;
  sku: string;
  rating: number;
  price: number;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
