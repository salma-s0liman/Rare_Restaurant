import { genderEnum, userRoleEnum } from "../../commen";

export interface ISignupBodyInputsDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender?: genderEnum;
  role?: userRoleEnum;
  vehicleInfo?: string | null;
  isActive?: boolean;
}
