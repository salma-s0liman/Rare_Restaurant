import { Repository, FindOptionsWhere } from "typeorm";
import { Address } from "../../DB/entity/address";
import { BaseRepository } from "../../common/repositories/BaseRepository";

export class AddressRepository extends BaseRepository<Address> {
  constructor(repo: Repository<Address>) {
    super(repo);
  }

  async find(where: FindOptionsWhere<Address>) {
    return this.repo.find({ where });
  }

  override async findById(id: string) {
    return super.findById(id, ["user"]);
  }
}
