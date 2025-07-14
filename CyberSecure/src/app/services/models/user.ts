import { Role } from "./role";



export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
  role?: Role;
  accountLocked?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  authorities?: Array<string>;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
  dateOfBirth?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  lastModifiedDate?: string;
}

