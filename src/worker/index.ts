import genericPool from 'generic-pool';
import {createWorker, Worker} from 'tesseract.js';
import config from '../config'
import fs from 'fs'

const langs = fs.readdirSync('lang-data').map(file => {
  return file.substr(0, file.length - '.traineddata.gz'.length)
})

const factory = {
  create: () => {
    return new Promise<Worker>(async (resolve, reject) => {
      const worker = createWorker({
        langPath: 'lang-data',
        cachePath: 'cache',
        logger: m => console.log(m),
      });

      try {
        await worker.load()
        for (let i = 0; i < langs.length; i++) {
          await worker.loadLanguage(langs[i])
        }

        resolve(worker)
      } catch (error) {
        reject(error)
      }
    })
  },
  destroy: (worker: Worker) => {
    return new Promise<void>((resolve, reject) => {
      return worker.terminate()
    })
  }
};

const opts = {
  min: config.workerPool.min,
  max: config.workerPool.max,
};

export const workerPool = genericPool.createPool<Worker>(factory, opts);

process.addListener('SIGTERM', async (signal) => {
  workerPool.drain()
  .then(() => workerPool.clear());
});