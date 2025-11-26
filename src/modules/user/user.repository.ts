import { User } from "../../DB";
import { AppDataSource } from "../../DB/data-source";
import { BaseRepository } from "../../DB/repositories/BaseRepository";

class UserRepository extends BaseRepository<User> {
    constructor() {
        super(AppDataSource.getRepository(User));
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }
}

export const userRepository = new UserRepository();