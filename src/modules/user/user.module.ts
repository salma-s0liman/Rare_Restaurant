import { Router } from "express";
import { DataSource, Repository } from "typeorm";
import { User } from "../../DB/entity/user";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { userRoutes } from "./user.routes";

export function UserModule(dataSource: DataSource): Router {
  const userRepo: Repository<User> = dataSource.getRepository(User);

  const userRepository = new UserRepository(userRepo);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  return userRoutes(userController);
}