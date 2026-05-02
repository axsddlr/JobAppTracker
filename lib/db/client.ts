'use client';

export {
  getAllApplications as getDB,
  saveApplications as saveDB,
  getApplication as getAppDB,
  putApplication as putAppDB,
  deleteApplication as deleteAppDB,
} from './operations';