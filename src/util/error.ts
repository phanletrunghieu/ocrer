export interface MyError  {
  rawError?: any
  httpStatus: number
  errorCode: number
  message: string
}

export const errMissingImageUrl = (rawError?: any): MyError => {
  return {
    rawError,
    errorCode: 10010,
    httpStatus: 500,
    message: "missing image's url",
  }
}

export const errOCR = (rawError?: any): MyError => {
  return {
    rawError,
    errorCode: 10020,
    httpStatus: 500,
    message: "fail to ocr",
  }
}