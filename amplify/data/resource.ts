import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Defines the schema for our database table
const schema = a.schema({
  Advice: a
    .model({
      userId: a.string().required(),
      adviceText: a.string().required(),
      // ✅ FIX: Timestamps should be required for reliable sorting
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      owner: a.string(), // This is automatically managed by Amplify for authorization
    })
    // ✅ FIX: Set the correct, more secure authorization rules
    // The user (owner) should only be able to read their own advice.
    // The backend Lambda function will handle creating/updating.
    .authorization((allow) => [
      allow.owner().to(['read'])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Use the logged-in user's identity to authorize access to the data
    defaultAuthorizationMode: 'userPool',
  },
});

