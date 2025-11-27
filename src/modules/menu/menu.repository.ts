import { Repository } from "typeorm";
import { AppDataSource } from "../../DB/data-source";
import { Restaurant, Category, MenuItem, MenuItemImage } from "../../DB/entity";
import { BaseRepository } from "../../DB/repositories/BaseRepository";
import {
  MenuQueryDto,
  RestaurantQueryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCategoryDto,
  MenuItemImageDto,
} from "./menu.dto";

class MenuRepository extends BaseRepository<MenuItem> {
  private restaurantRepository: Repository<Restaurant>;
  private categoryRepository: Repository<Category>;
  private menuItemImageRepository: Repository<MenuItemImage>;

  constructor() {
    super(AppDataSource.getRepository(MenuItem));
    this.restaurantRepository = AppDataSource.getRepository(Restaurant);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.menuItemImageRepository = AppDataSource.getRepository(MenuItemImage);
  }

  // Restaurant methods
  async getAllRestaurants(query: RestaurantQueryDto) {
    const { active_only, search, page, limit } = query;

    let queryBuilder = this.restaurantRepository
      .createQueryBuilder("restaurant")
      .leftJoinAndSelect("restaurant.categories", "categories")
      .leftJoinAndSelect(
        "restaurant.menu_items",
        "menu_items",
        "menu_items.is_available = true"
      )
      .addSelect([
        "COUNT(DISTINCT categories.id) as categories_count",
        "COUNT(DISTINCT menu_items.id) as menu_items_count",
      ])
      .groupBy("restaurant.id")
      .addGroupBy("categories.id")
      .addGroupBy("menu_items.id");

    if (active_only) {
      queryBuilder = queryBuilder.where("restaurant.is_active = :active", {
        active: true,
      });
    }

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        "(restaurant.name ILIKE :search OR restaurant.address ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    const offset = (page! - 1) * limit!;
    queryBuilder = queryBuilder.skip(offset).take(limit);

    const [restaurants, total] = await queryBuilder.getManyAndCount();

    return {
      restaurants,
      pagination: {
        page: page!,
        limit: limit!,
        total,
        pages: Math.ceil(total / limit!),
      },
    };
  }

  async getRestaurantById(id: string) {
    return await this.restaurantRepository
      .createQueryBuilder("restaurant")
      .leftJoinAndSelect("restaurant.categories", "categories")
      .leftJoinAndSelect("restaurant.menu_items", "menu_items")
      .where("restaurant.id = :id", { id })
      .getOne();
  }

  async getRestaurantMenu(restaurantId: string, query: MenuQueryDto) {
    const {
      category_id,
      min_price,
      max_price,
      available_only,
      search,
      page,
      limit,
    } = query;

    // First get the restaurant
    const restaurant = await this.restaurantRepository
      .createQueryBuilder("restaurant")
      .where("restaurant.id = :id", { id: restaurantId })
      .getOne();

    if (!restaurant) {
      return null;
    }

    // Build menu items query
    let menuItemsQuery = this.repo
      .createQueryBuilder("menuItem")
      .leftJoinAndSelect("menuItem.category", "category")
      .leftJoinAndSelect("menuItem.images", "images")
      .leftJoinAndSelect("menuItem.restaurant", "restaurant")
      .where("menuItem.restaurant_id = :restaurantId", { restaurantId });

    if (category_id) {
      menuItemsQuery = menuItemsQuery.andWhere(
        "menuItem.category_id = :categoryId",
        { categoryId: category_id }
      );
    }

    if (min_price !== undefined) {
      menuItemsQuery = menuItemsQuery.andWhere("menuItem.price >= :minPrice", {
        minPrice: min_price,
      });
    }

    if (max_price !== undefined) {
      menuItemsQuery = menuItemsQuery.andWhere("menuItem.price <= :maxPrice", {
        maxPrice: max_price,
      });
    }

    if (available_only) {
      menuItemsQuery = menuItemsQuery.andWhere(
        "menuItem.is_available = :available",
        { available: true }
      );
    }

    if (search) {
      menuItemsQuery = menuItemsQuery.andWhere(
        "(menuItem.name ILIKE :search OR menuItem.description ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    const offset = (page! - 1) * limit!;
    menuItemsQuery = menuItemsQuery
      .skip(offset)
      .take(limit)
      .orderBy("category.name", "ASC")
      .addOrderBy("menuItem.name", "ASC");

    const [menuItems, total] = await menuItemsQuery.getManyAndCount();

    // Get categories with item counts
    const categories = await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoin("category.menu_items", "menuItem")
      .where("category.restaurant_id = :restaurantId", { restaurantId })
      .addSelect("COUNT(menuItem.id)", "items_count")
      .groupBy("category.id")
      .getRawAndEntities();

    return {
      restaurant,
      menuItems,
      categories: categories.entities,
      pagination: {
        page: page!,
        limit: limit!,
        total,
        pages: Math.ceil(total / limit!),
      },
    };
  }

  // Menu Item methods
  async getMenuItemById(id: string) {
    return await this.repo
      .createQueryBuilder("menuItem")
      .leftJoinAndSelect("menuItem.category", "category")
      .leftJoinAndSelect("menuItem.images", "images")
      .leftJoinAndSelect("menuItem.restaurant", "restaurant")
      .where("menuItem.id = :id", { id })
      .getOne();
  }

  async createMenuItem(restaurantId: string, data: CreateMenuItemDto) {
    const menuItem = this.repo.create({
      ...data,
      restaurant: { id: restaurantId } as Restaurant,
      category: { id: data.category_id } as Category,
    });

    return await this.repo.save(menuItem);
  }

  async updateMenuItem(id: string, data: UpdateMenuItemDto) {
    const updateData: any = { ...data };

    if (data.category_id) {
      updateData.category = { id: data.category_id };
      delete updateData.category_id;
    }

    await this.repo.update(id, updateData);
    return await this.getMenuItemById(id);
  }

  async deleteMenuItem(id: string) {
    const result = await this.repo.delete(id);
    return result.affected! > 0;
  }

  // Category methods
  async getCategoriesByRestaurant(restaurantId: string) {
    return await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndSelect(
        "category.menu_items",
        "menuItems",
        "menuItems.is_available = true"
      )
      .where("category.restaurant_id = :restaurantId", { restaurantId })
      .orderBy("category.name", "ASC")
      .getMany();
  }

  async createCategory(restaurantId: string, data: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      ...data,
      restaurant: { id: restaurantId } as Restaurant,
    });

    return await this.categoryRepository.save(category);
  }

  async updateCategory(id: string, data: CreateCategoryDto) {
    await this.categoryRepository.update(id, data);
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: string) {
    const result = await this.categoryRepository.delete(id);
    return result.affected! > 0;
  }

  // Menu Item Image methods
  async addMenuItemImage(menuItemId: string, data: MenuItemImageDto) {
    // If this is set as primary, unset other primary images for this menu item
    if (data.is_primary) {
      await this.menuItemImageRepository.update(
        { menu_item: { id: menuItemId } },
        { is_primary: false }
      );
    }

    const image = this.menuItemImageRepository.create({
      ...data,
      menu_item: { id: menuItemId } as MenuItem,
    });

    return await this.menuItemImageRepository.save(image);
  }

  async removeMenuItemImage(imageId: string) {
    const result = await this.menuItemImageRepository.delete(imageId);
    return result.affected! > 0;
  }

  async getMenuItemImages(menuItemId: string) {
    return await this.menuItemImageRepository
      .createQueryBuilder("image")
      .where("image.menu_item_id = :menuItemId", { menuItemId })
      .orderBy("image.is_primary", "DESC")
      .addOrderBy("image.created_at", "ASC")
      .getMany();
  }
}

export default new MenuRepository();
