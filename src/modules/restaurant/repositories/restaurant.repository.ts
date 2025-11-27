import { Repository } from "typeorm";
import { BaseRepository } from "../../../DB/repositories/BaseRepository";
import { Restaurant } from "../../../DB/entity/restaurant";

export class RestaurantRepository extends BaseRepository<Restaurant> {
  constructor(repo: Repository<Restaurant>) {
    super(repo);
  }

  async findActive(): Promise<Restaurant[]> {
    return this.repo.find({ where: { is_active: true } });
  }
}
