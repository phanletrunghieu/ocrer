import {Response} from 'express'
import {MyError} from './error'

export const success = (res: Response, data?: any) => {
  res.status(200).json({
    status: "success",
    code: 200,
    data,
  })
}

export const error = (res: Response, err: MyError) => {
  res.status(err.httpStatus).json({
    status: "error",
    code: err.errorCode,
    message: err.message,
  })
}