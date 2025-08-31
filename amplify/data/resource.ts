// amplify/data/resource.ts

import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Define the schema for our database table
const schema = a.schema({
  Advice: a.model({
    // The user's unique ID, so we know who the advice belongs to
    userId: a.string().required(),
    // The actual text of the tax advice
    adviceText: a.string().required(),
    // The owner field is automatically populated and used for authorization
    owner: a.string(),
  })
  // This sets the authorization rules.
  // It allows the owner of a record (the logged-in user) to read their own advice.
  .authorization(allow => [allow.owner()]),
});

// Export the data resource type
export type Schema = ClientSchema<typeof schema>;

// Export the data resource
export const data = defineData({
  schema,
  authorizationModes: {
    // Use the logged-in user's identity to authorize access
    defaultAuthorizationMode: 'userPool',
  },
});