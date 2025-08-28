// amplify/storage/resource.ts

import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'ai-tax-advisor-storage',
  access: (allow) => ({
    'private/{user_identity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});