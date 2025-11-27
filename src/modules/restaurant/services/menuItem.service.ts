import { MenuItemRepository } from "../repositories/menuItem.repository";
import { MenuItemImageRepository } from "../repositories/menuItemImage.repository";
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from "../dtos/menuItem.dto";
import {
  CreateMenuItemImageDto,
} from "../dtos/menuItemImage.dto";

export class MenuItemService {

  constructor(
    private menuItemRepo: MenuItemRepository,
    private imageRepo: MenuItemImageRepository
  ) {}

  async createMenuItem(data: CreateMenuItemDto) {
    return await this.menuItemRepo.create(data);
  }

  async getMenuItems(restaurantId: string) {
    return await this.menuItemRepo.findByRestaurant(restaurantId);
  }

  async updateMenuItem(id: string, data: UpdateMenuItemDto) {
    return await this.menuItemRepo.update(id, data);
  }

  async deleteMenuItem(id: string) {
    return await this.menuItemRepo.delete(id);
  }

  // IMAGES
  async addImage(menuItemId: string, data: CreateMenuItemImageDto) {
    return await this.imageRepo.create({
      ...data,
      menu_item: { id: menuItemId } as any,
    });
  }

  async getImages(menuItemId: string) {
    return await this.imageRepo.findByMenuItem(menuItemId);
  }
}
