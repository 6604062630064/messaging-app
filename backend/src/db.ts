import postgres from "postgres";
const { DATABASE_PASSWORD } = process.env;
const sql = postgres(
	`postgres://postgres.jthievostxaxmptcnqyp:${DATABASE_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
);
export default sql;
