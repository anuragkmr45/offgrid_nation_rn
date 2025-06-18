import 'dotenv/config';

export default {
  expo: {
    name: 'offgrid-nation-rn',
    slug: 'offgrid-nation-rn',
    version: '1.0.0',
    // …copy any other fields you currently have in app.json…
    extra: {
      PUSHER_KEY: process.env.PUSHER_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    },
  },
};