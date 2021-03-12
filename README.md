# OCRer

## Usage

```bash
docker run --rm -t -p 3000:3000 phanletrunghieu/ocrer:latest
```

## API

### 1. OCR by image url

**Path:** POST /url

**Request body:**

| Params | Type | Description |
|--|--|--|
| lang | string | Language |
| url | string | Image's URL |


**Example:**

```
curl --request POST \
  --url http://localhost:3000/url \
  --header 'Content-Type: application/json' \
  --data '{
	"lang": "eng",
	"url": "https://tesseract.projectnaptha.com/img/eng_bw.png"
}'
```

### 2. OCR by uploading image

**Path:** POST /upload

**Request body:**

| Params | Type | Description |
|--|--|--|
| lang | string | Language |
| image | file | Image to ocr |


**Example:**

```
curl --request POST \
  --url http://localhost:3000/upload \
  --header 'Content-Type: multipart/form-data' \
  --header 'content-type: multipart/form-data; boundary=---011000010111000001101001' \
  --form lang=vie \
  --form image=@ocr.png
```