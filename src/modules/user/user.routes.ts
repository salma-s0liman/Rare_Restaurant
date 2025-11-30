import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../common";
import { userRoleEnum } from "../../common/enums";

export const userRoutes = (userController: UserController) => {
  const router = Router();

  // Self-service routes (authenticated user managing own account)
  router.get(
    "/profile", 
    auth(), 
    userController.getMyProfile.bind(userController)
  );

  router.put(
    "/profile", 
    auth(), 
    userController.updateMyProfile.bind(userController)
  );

  router.put(
    "/change-password", 
    auth(), 
    userController.changePassword.bind(userController)
  );

  router.put(
    "/profile-picture", 
    auth(), 
    userController.updateProfilePicture.bind(userController)
  );

  router.get(
    "/preferences", 
    auth(), 
    userController.getMyPreferences.bind(userController)
  );

  router.put(
    "/preferences", 
    auth(), 
    userController.updateMyPreferences.bind(userController)
  );

  router.get(
    "/stats", 
    auth(), 
    userController.getMyStats.bind(userController)
  );

  router.delete(
    "/deactivate", 
    auth(), 
    userController.deactivateMyAccount.bind(userController)
  );

  // Admin/Manager routes for user management
  router.get(
    "/search",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.searchUsers.bind(userController)
  );

  router.get(
    "/role/:role",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUsersByRole.bind(userController)
  );

  router.get(
    "/active",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getAllActiveUsers.bind(userController)
  );

  router.get(
    "/:userId/profile",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUserProfile.bind(userController)
  );

  router.get(
    "/:userId/stats",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUserStats.bind(userController)
  );

  router.get(
    "/:userId/details",
    auth([userRoleEnum.admin, userRoleEnum.owner, userRoleEnum.manager]),
    userController.getUserWithRelations.bind(userController)
  );

  router.put(
    "/:userId/reactivate",
    auth([userRoleEnum.admin, userRoleEnum.owner]),
    userController.reactivateUser.bind(userController)
  );

  return router;
};