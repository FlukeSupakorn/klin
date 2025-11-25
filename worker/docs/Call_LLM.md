## 1. Call LLM
### To worker directory
```bash
cd worker
```

### To Test the response from LLM run the following command
```bash
uv run python */klin/worker/app/adapters/call_llm.py
```
### BUT!!!
### at line 40 you can change the model to any other model supported by Ollama
```python
llm = OllamaLLM(model="gemma3:4b")
```


The **request** and **destination** json used in the call_llm.py is in folder db/jsondb

when finished the result will be saved in folder db/jsondb as **result.json**

## 2. Rag
### Not fully finished yet but usable
It will create another database elsewhere not the initial one.
```bash
uv run python */klin/worker/app/services/rag.py
```

## 3. Search
### Not finished yet leave it for now