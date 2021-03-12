# OCRer

## Usage

```bash
docker run --rm -t -p 3000:3000 phanletrunghieu/ocrer:latest
```

## API

### OCR by image url

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