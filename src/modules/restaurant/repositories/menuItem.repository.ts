import { Repository } from "typeorm";
import { MenuItem } from "../../../DB/entity/menuItem";
import { BaseRepository } from "../../../common";

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
