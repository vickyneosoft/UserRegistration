export enum ImagePickerActions {
  CAMERA = 'CAMERA',
  GALLERY = 'GALLERY',
}

export enum PermissionResult {
  GRANTED = 1,
  DENIED = 0,
  BLOCKED = -1,
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum EducationOptions {
  POST_GRADUATE = 'post_graduate',
  GRADUATE = 'graduate',
  HSC_DIPLOMA = 'hsc_diploma',
  SSC = 'ssc',
}

export interface CommonUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: number | undefined;
  profilePhoto: string;
  gender: Gender | unknown;
  qualification: EducationOptions;
  dob: number
}

export interface UserPayload extends CommonUserPayload {
  id: string
}

export interface AddUserPayload extends CommonUserPayload {
  password: string;
}