import { ApplicationDao } from './application.dao';
import { UserDao } from './user.dao';

export * from './application.dao';
export * from './user.dao';

export const daos = [UserDao, ApplicationDao];
