import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

// This defines the entire backend and includes the auth resource you created.
const backend = defineBackend({
  auth,
});