import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
} from "typeorm";
import { IRepository } from "./IRepository";

// This is an abstract class so you can't use it directly, you must extend it
export abstract class BaseRepository<T extends Object>
  implements IRepository<T>
{
  constructor(protected readonly repo: Repository<T>) {}

  // 1. Create
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  // 2. Find All (with pagination support built-in via options)
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repo.find(options);
  }

  // 3. Find by ID (Simplified)
  async findById(id: any, relations: string[] = []): Promise<T | null> {
    // We use 'as any' for the ID query because TypeORM creates generic queries difficultly
    const options: FindOneOptions<T> = {
      where: { id } as any,
      relations: relations,
    };
    return await this.repo.findOne(options);
  }

  // 4. Find One (Specific criteria like email, phone, etc.)
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repo.findOne(options);
  }

  // 5. Update
  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    // First check if exists
    const existing = await this.findById(id);
    if (!existing) return null;

    // Merge new data into existing entity
    this.repo.merge(existing, data);
    return await this.repo.save(existing);
  }

  // 6. Delete
  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
