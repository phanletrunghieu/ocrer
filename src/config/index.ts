import dotenv from 'dotenv'

dotenv.config()

export default {
  httpPort: parseInt(process.env.PORT || "", 10) || 3000,
  workerPool: {
    min: parseInt(process.env.WORKER_POOL_MIN || "", 10) || 2,
    max: parseInt(process.env.WORKER_POOL_MAX || "", 10) || 10,
  }
}