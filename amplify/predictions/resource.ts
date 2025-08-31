import { definePredictions } from '@aws-amplify/backend-cli/constructs';

export const predictions = definePredictions({
  name: 'taxAdvisorPredictions',
  identify: {
    identifyText: {
      defaults: {
        format: 'PLAIN',
      },
    },
  },
});

