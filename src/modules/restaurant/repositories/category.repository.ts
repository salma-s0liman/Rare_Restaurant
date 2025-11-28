import { Repository } from "typeorm";
import { Category } from "../../../DB/entity/category";
import { BaseRepository } from "../../../common";

export class CategoryRepository extends BaseRepository<Category> {
  constructor(repo: Repository<Category>) {
    super(repo);
  }

  async findByRestaurant(restaurantId: string) {
    return this.repo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ["menu_items"],
    });
  }
}
