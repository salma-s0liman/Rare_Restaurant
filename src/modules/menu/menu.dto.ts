// Request DTOs
export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  category_id: string;
  is_available?: boolean;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  category_id?: string;
  is_available?: boolean;
}

export interface MenuItemImageDto {
  url: string;
  alt_text?: string;
  is_primary?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

// Response DTOs
export interface MenuItemResponseDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  created_at: Date;
  category: {
    id: string;
    name: string;
    description?: string;
  };
  images: {
    id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
  }[];
  restaurant: {
    id: string;
    name: string;
  };
}

export interface CategoryWithItemsDto {
  id: string;
  name: string;
  description?: string;
  items_count: number;
  menu_items: MenuItemResponseDto[];
}

export interface RestaurantMenuDto {
  restaurant: {
    id: string;
    name: string;
    address: string;
    phone: string;
    is_active: boolean;
  };
  categories: CategoryWithItemsDto[];
  total_items: number;
}

export interface RestaurantListDto {
  id: string;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
  categories_count: number;
  menu_items_count: number;
}

// Query DTOs
export interface MenuQueryDto {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  available_only?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RestaurantQueryDto {
  active_only?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
