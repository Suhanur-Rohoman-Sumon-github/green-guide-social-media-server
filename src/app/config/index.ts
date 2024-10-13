import dotenv from 'dotenv';

import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_Env: process.env.Node_Env,
  port: process.env.PORT,
  dbUri: process.env.DB_URL,
  bcrypt_salt_round: process.env.bcrypt_salt_round,
  default_password: process.env.default_password,
  access_secret_key: process.env.JWT_ACCESS_SECRET,
  refresh_secret_key: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  stripe_secret: process.env.Stripe_secret_key,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
};
