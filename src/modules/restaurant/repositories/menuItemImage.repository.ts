import { Repository } from "typeorm";
import { MenuItemImage } from "../../../DB/entity/menuItemImage";
import { BaseRepository } from "../../../common";

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
