import { FindManyOptions, FindOneOptions, DeepPartial } from "typeorm";


export interface IRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  findById(id: string, relations?: string[]): Promise<T | null>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  update(id: string, data: DeepPartial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
