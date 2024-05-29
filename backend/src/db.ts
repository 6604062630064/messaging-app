import postgres from "postgres";
const { DATABASE_PASSWORD, DATABASE_USERNAME } = process.env;
const sql = postgres(
	`postgres://postgres.${DATABASE_USERNAME}:${DATABASE_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
);
export default sql;
