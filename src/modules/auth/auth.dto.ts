import { genderEnum, userRoleEnum } from "../../common";

export interface ILoginBodyInputsDto {
  email: string;
  password: string;
}

export interface ISignupBodyInputsDto extends ILoginBodyInputsDto {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  confirmPassword: string;
  gender?: genderEnum;
  role?: userRoleEnum;
  vehicleInfo?: string | null;
  isActive?: boolean;
}
