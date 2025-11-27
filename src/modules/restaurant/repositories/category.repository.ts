import { Repository } from "typeorm";
import { BaseRepository } from "../../../DB/repositories/BaseRepository";
import { Category } from "../../../DB/entity/category";

export class CategoryRepository extends BaseRepository<Category> {
  constructor(repo: Repository<Category>) {
    super(repo);
  }

  async findByRestaurant(restaurantId: string) {
    return this.repo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ["menuItems"],
    });
  }
}
