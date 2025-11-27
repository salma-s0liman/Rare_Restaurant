import { AppDataSource } from "../../DB/data-source";
import { User } from "../../DB/";
import { BaseRepository } from "../../common";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }
}

export const userRepository = new UserRepository();
