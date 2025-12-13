# **API Specifications (Tauri ↔ FastAPI Worker)**

Tauri front-end communicates with the worker over `http://localhost:<port>`.

---

## **1. POST /organize**

**Description:** get file path and rules from Tauri, process file, return extracted text and metadata for planning.

```json
{
	"organize" : [
		"C:\Users\oatln\Downloads/test1.pdf",
		"C:\Users\oatln\Downloads/test2.pdf",
		"C:\Users\oatln\Downloads/test3.pdf"
	], 
	"rules" : [
		"check_dup" : true,
		"allow_rename": true
	]
}
```

**Response**

```json
{
	"reuslt" : [
		"<filepath1>": [
			"move": "destination",
			"rename": "new name",
			"summary": null,
			"duplicate":[array],
			"confidence": float,
			
		],
		"C:\Windows\system\test.pdf": [
			"move": "C:\Windows\storage",
			"rename": "presentation.pdf",
			"summary": null,
			"duplicate":null,
			"confidence": 0.91,
		],
  ]
}
```

---

## **2. POST /summary**

**Description:** Create summary notes for given files.

```json
{
	"summary" : [
		"C:\Users\oatln\Downloads/test1.pdf",
		"C:\Users\oatln\Downloads/test2.pdf",
		"C:\Users\oatln\Downloads/test3.pdf"
	]
}
```

**Response**

```json
{
	"reuslt" : [
		"<filepath1>": [
			"summary": TEXT,
			
		],
		"C:\Windows\system\test.pdf": [
			"summary": null,
		],
  ]
}
```

---


## **3. GET /history**

Returns organize history for UI display.

---