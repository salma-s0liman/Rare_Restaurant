import { Repository } from "typeorm";
import { Restaurant } from "../../../DB/entity/restaurant";
import { BaseRepository } from "../../../common";

export class RestaurantRepository extends BaseRepository<Restaurant> {
  constructor(repo: Repository<Restaurant>) {
    super(repo);
  }

  async findActive(): Promise<Restaurant[]> {
    return this.repo.find({ where: { is_active: true } });
  }
}
