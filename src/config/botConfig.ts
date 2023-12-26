import dotenv from 'dotenv';
dotenv.config();

export const botConfig = {
  token: process.env.BOT_TOKEN as string,
};
