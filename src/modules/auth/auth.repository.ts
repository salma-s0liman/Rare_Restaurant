import { User } from "../../DB";
import { AppDataSource } from "../../DB/data-source";
import { BaseRepository } from "../../DB/repositories/BaseRepository";

class UserRepository extends BaseRepository<User> {
    constructor() {
        // Initialize the BaseRepository with the specific TypeORM repo for User
        super(AppDataSource.getRepository(User));
    }

    // You can add custom methods here that are specific ONLY to Users
    // The BaseRepository already handles findById, create, update, etc.

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }
}

// Export a single instance to use in your Service
export const userRepository = new UserRepository();