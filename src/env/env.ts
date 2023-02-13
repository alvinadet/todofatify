require("dotenv").config()

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DBNAME } =
  process.env

export const env = {
  MYSQL_HOST: MYSQL_HOST!,
  MYSQL_PORT: Number(MYSQL_PORT)! as number,
  MYSQL_USER: MYSQL_USER!,
  MYSQL_PASSWORD: MYSQL_PASSWORD!,
  MYSQL_DBNAME: MYSQL_DBNAME!,
}
