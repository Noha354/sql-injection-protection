// import { Client } from "pg";

// export const createPgClient = () => {
//   return new Client({
//     host: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     port: 5432, // Default PostgreSQL port
//     user: process.env.NEXT_PUBLIC_SUPABASE_USER,
//     password: process.env.NEXT_PUBLIC_SUPABASE_PASSWORD,
//     database: process.env.NEXT_PUBLIC_SUPABASE_DATABASE,
//   });
// };

import { Pool } from "pg";

// export const createPgClient = () => {
//   return new Pool({
//     connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
//   });
// };

export const createPgClient = () => {
  return new Pool({
    host: process.env.NEXT_PUBLIC_SUPABASE_URL,
    port: 5432, // Default PostgreSQL port
    user: process.env.NEXT_PUBLIC_SUPABASE_USER,
    password: process.env.NEXT_PUBLIC_SUPABASE_PASSWORD,
    database: process.env.NEXT_PUBLIC_SUPABASE_DATABASE,
  });
};
