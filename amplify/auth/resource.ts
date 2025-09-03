import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  // This is the correct way to configure login.
  // We specify that users can log in with their email.
  // By default, a user-provided 'username' is also enabled as the primary identifier.
  loginWith: {
    email: true,
  },
});