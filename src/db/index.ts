import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
  connectionString: config.database_url,
});

export const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(20) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                is_active BOOLEAN DEFAULT true,
                role VARCHAR(10) DEFAULT 'contributor',

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
  } catch (error) {}
};

// id	Auto-incrementing unique identifier for each account
// name	Full display name of the team member, must be provided
// email	Valid login address, must be unique across all accounts, must be provided
// password	Encrypted string stored securely, must be provided during registration, never returned in responses
// role	Determines system access level, defaults to contributor, must be contributor or maintainer
// created_at	Timestamp marking when the account was created, automatically generated on insert
// updated_at
