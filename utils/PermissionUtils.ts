import Permissions, {
  Permission,
  PermissionStatus,
} from 'react-native-permissions';
import {PermissionResult} from '../types';

export const requestMultiplePermissions = async (permissions: Permission[]) => {
  try {
    const reqRes: Record<Permission, PermissionStatus> =
      await Permissions.requestMultiple(permissions);
    if (
      Object.keys(reqRes).every(
        (permissionName: Permission) => reqRes[permissionName] === 'granted',
      )
    ) {
      return PermissionResult.GRANTED;
    } else if (
      Object.keys(reqRes).some(
        permissionName => reqRes[permissionName] === 'denied',
      )
    ) {
      return PermissionResult.DENIED;
    } else if (
      Object.keys(reqRes).some(
        permissionName => reqRes[permissionName] === 'blocked',
      )
    ) {
      return PermissionResult.BLOCKED;
    } else {
      return PermissionResult.BLOCKED;
    }
  } catch (err: any) {
    console.log('getPermissionHandler : ', err.message);
    return PermissionResult.BLOCKED;
  }
};

export const checkMultiplePermissions = async (
  permissions: Permission[],
): Promise<PermissionResult> => {
  try {
    const reqRes = await Permissions.checkMultiple(permissions);
    if (
      Object.keys(reqRes).every(
        permissionName => reqRes[permissionName] === 'granted',
      )
    ) {
      return PermissionResult.GRANTED;
    } else if (
      Object.keys(reqRes).some(
        permissionName => reqRes[permissionName] === 'denied',
      )
    ) {
      return PermissionResult.DENIED;
    } else if (
      Object.keys(reqRes).some(
        permissionName => reqRes[permissionName] === 'blocked',
      )
    ) {
      return PermissionResult.BLOCKED;
    } else {
      return PermissionResult.BLOCKED;
    }
  } catch (err: any) {
    console.log('getCameraPermissionHandler : ', err.message);
    return PermissionResult.BLOCKED;
  }
};

export const requestSinglePermission = async (permission: Permission) => {
  try {
    const reqRes = await Permissions.request(permission);

    let returnVal: PermissionResult = PermissionResult.BLOCKED;
    switch (reqRes) {
      case 'granted':
        returnVal = PermissionResult.GRANTED;
        break;
      case 'blocked':
        returnVal = PermissionResult.BLOCKED;
        break;
      case 'denied':
        returnVal = PermissionResult.DENIED;
        break;
      default:
        returnVal = PermissionResult.BLOCKED;
    }
    return returnVal;
  } catch (err: any) {
    console.log('getCameraPermissionHandler : ', err.message);
    return PermissionResult.BLOCKED;
  }
};

export const checkSinglePermission = async (
  permission: Permission,
): Promise<PermissionResult> => {
  try {
    const reqRes = await Permissions.check(permission);

    let returnVal: PermissionResult = PermissionResult.BLOCKED;
    switch (reqRes) {
      case 'granted':
        returnVal = PermissionResult.GRANTED;
        break;
      case 'blocked':
        returnVal = PermissionResult.BLOCKED;
        break;
      case 'denied':
        returnVal = PermissionResult.DENIED;
        break;
      default:
        returnVal = PermissionResult.BLOCKED;
    }
    return returnVal;
  } catch (err: any) {
    console.log('getCameraPermissionHandler : ', err.message);
    return PermissionResult.BLOCKED;
  }
};
