import mysql from 'mysql2/promise'

export async function getCLConnection() {
  return mysql.createConnection({
    host: process.env.RDS_CL_HOST!,
    user: process.env.RDS_CL_USER!,
    password: process.env.RDS_CL_PASSWORD!,
    database: process.env.RDS_CL_DATABASE!,
  })
}

export async function getPEConnection() {
  console.log("process.env.RDS_PE_HOST",process.env.RDS_PE_HOST)
  return mysql.createConnection({
    host: process.env.RDS_PE_HOST!,
    user: process.env.RDS_PE_USER!,
    password: process.env.RDS_PE_PASSWORD!,
    database: process.env.RDS_PE_DATABASE!,
  })
}
