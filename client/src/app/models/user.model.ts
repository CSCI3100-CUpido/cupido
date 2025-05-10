// src/app/models/user.model.ts
export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
  photoUrl?: string;
  dateOfBirth?: Date;
  created?: Date;
  lastActive?: Date;
  gender?: string;
  interests?: string[];
  city?: string;
  country?: string;
  bio?: string;
  isEmailVerified: boolean;
  roles?: string[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: Date;
  gender?: string;
}