// src/instrumentation.ts
import * as dotenv from 'dotenv';
dotenv.config();

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Any server-side startup code can go here.
  }
}
