import http from 'http'
import express, {Request, Response} from 'express'
import fileUpload, {UploadedFile} from 'express-fileupload'
import morgan from 'morgan'
import { workerPool } from '../../worker'
import { success, error } from '../../util/response'
import config from '../../config'
import {
  errMissingImage,
  errMissingImageUrl,
  errOCR,
} from '../../util/error'

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(morgan(
  ':response-time :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  {
    skip: function (req: Request, res: Response) {
      return req.path === "/health_check"
    }
  }
))

app.get('/health_check', (req: Request, res: Response) => {
  success(res, "ok")
})

app.post('/url', (req: Request, res: Response) => {
  const imageURL = req.body['url']
  const lang = (req.body['lang'] as string) || "eng"
  if (!imageURL) {
    error(res, errMissingImageUrl())

    return
  }
  
  const workerPromise = workerPool.acquire()
  workerPromise.then(async (worker) => {
    try {
      await worker.initialize(lang);
      const { data: { text } } = await worker.recognize(
        imageURL.toString() as string,
      );

      success(res, text);
    } catch (err) {
      error(res, errOCR(err))
    }

    workerPool.release(worker);
  })
})

app.post('/upload', (req: Request, res: Response) => {
  const lang = (req.body['lang'] as string) || "eng";
  if (!(req.files && req.files['image'])) {
    error(res, errMissingImage())
    
    return
  }

  let image = req.files['image'] as UploadedFile

  const workerPromise = workerPool.acquire()
  workerPromise.then(async (worker) => {
    try {
      await worker.initialize(lang);
      const { data: { text } } = await worker.recognize(
        image.data
      );

      success(res, text);
    } catch (err) {
      error(res, errOCR(err))
    }

    workerPool.release(worker);
  })
})

export const start = () => {
  const server = app.listen(config.httpPort)

  process.addListener('SIGTERM', async (signal) => {
    server.close();
  });
}