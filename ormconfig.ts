const config = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,
  synchronize: false,
  logging: true,
  migrations: ["migrations/**/*.ts"],
  entities: ["src/**/*.entity{.ts,.js}"],
  cli: {
    migrationsDir: "migrations",
  },
}

export default config
