import { Repository } from "typeorm";
import { BaseRepository } from "../../../DB/repositories/BaseRepository";
import { MenuItem } from "../../../DB/entity/menuItem";

export class MenuItemRepository extends BaseRepository<MenuItem> {
  constructor(repo: Repository<MenuItem>) {
    super(repo);
  }

  async findByRestaurant(restaurantId: string) {
    return this.repo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ["images", "category"],
    });
  }
}
