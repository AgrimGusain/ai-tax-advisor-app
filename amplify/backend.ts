import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource'; // 👈 Import the storage resource

const backend = defineBackend({
  auth,
  storage, // 👈 Add the storage resource here
});
