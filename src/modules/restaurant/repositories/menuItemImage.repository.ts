import { Repository } from "typeorm";
import { BaseRepository } from "../../../DB/repositories/BaseRepository";
import { MenuItemImage } from "../../../DB/entity/menuItemImage";

export class MenuItemImageRepository extends BaseRepository<MenuItemImage> {
  constructor(repo: Repository<MenuItemImage>) {
    super(repo);
  }

  async findByMenuItem(menuItemId: string) {
    return this.repo.find({
      where: { menu_item: { id: menuItemId } },
    });
  }
}
