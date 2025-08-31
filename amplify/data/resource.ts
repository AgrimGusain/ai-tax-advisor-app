// amplify/data/resource.ts

import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Advice: a
    .model({
      userId: a.string().required(),
      adviceText: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete'])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});