import { CategoryRepository } from "../repositories/category.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";

export class CategoryService {
  constructor(private categoryRepo: CategoryRepository) {}

  async createCategory(data: CreateCategoryDto) {
    return await this.categoryRepo.create(data);
  }

  async getCategories(restaurantId: string) {
    return await this.categoryRepo.findByRestaurant(restaurantId);
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    return await this.categoryRepo.update(id, data);
  }

  async deleteCategory(id: string) {
    return await this.categoryRepo.delete(id);
  }
}
