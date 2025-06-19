import 'dotenv/config';

export default {
  expo: {
    name: "Offgrid Nation",
    slug: "offgrid-nation",
    version: '1.0.0',
    "scheme": "offgrid",
    // …copy any other fields you currently have in app.json…
    extra: {
      PUSHER_KEY: process.env.PUSHER_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    },
  },
};