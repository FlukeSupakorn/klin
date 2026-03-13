# AI Module Breakdown: TODO List & Evaluation Criteria

This document provides a comprehensive breakdown of the AI module with evaluation criteria, testing guidelines, and file organization recommendations.

---

## 📁 Overview of AI-Related Components

| Component | Current Files | Purpose |
|-----------|---------------|---------|
| **LLM Calling** | `app/adapters/call_llm.py` | Direct LLM invocation for organize planning |
| **VLM OCR** | `app/adapters/ollama_vlm.py` | Text extraction using vision-language model |
| **Embeddings** | `app/services/rag.py` | Vector embedding generation |
| **Hybrid Search** | `app/services/hybrid_search.py` | Vector + lexical search |
| **Planning** | `app/services/planning.py` | Organization plan generation |

---

## 📋 TODO List by Feature

### 1. Text Extraction (OCR/VLM) Evaluation

**Location:** `app/adapters/ollama_vlm.py`

| Task | Priority | Evaluation Criteria | Status |
|------|----------|---------------------|--------|
| Create test dataset with ground truth | High | N/A | ☐ |
| Implement Character Error Rate (CER) metric | High | CER < 5% for clean docs | ☐ |
| Implement Word Error Rate (WER) metric | High | WER < 10% for clean docs | ☐ |
| Test across file types (PDF, DOCX, PPTX, XLSX, images) | High | 90%+ success rate per type | ☐ |
| Measure extraction latency | Medium | < 10s for typical document | ☐ |
| Compare VLM vs traditional OCR (Tesseract) | Medium | Quality/speed tradeoff documented | ☐ |
| Handle multi-language documents | Low | Support for Thai, English at minimum | ☐ |

**Suggested Test Structure:**
```
tests/
  test_ocr_accuracy.py
  fixtures/
    ocr_ground_truth/
      sample1.pdf
      sample1_expected.txt  # ground truth
      sample2.png
      sample2_expected.txt
```

---

### 2. Classification & Embedding Evaluation

**Locations:**
- `app/services/rag.py` (embedding generation)
- `app/services/hybrid_search.py` (search)

| Task | Priority | Evaluation Criteria | Status |
|------|----------|---------------------|--------|
| Create labeled dataset for category classification | High | 100+ samples across categories | ☐ |
| Implement classification accuracy metric | High | > 85% top-1 accuracy | ☐ |
| Implement Mean Reciprocal Rank (MRR) | High | MRR > 0.8 for search | ☐ |
| Test embedding consistency (same doc = same vector) | High | Cosine similarity > 0.99 | ☐ |
| Benchmark embedding model options | Medium | Compare `all-MiniLM-L6-v2` vs others | ☐ |
| Measure search recall@k | Medium | Recall@5 > 90% | ☐ |
| Test with edge cases (empty text, very long text) | Medium | Graceful handling | ☐ |

**Metrics to Implement:**
```python
def calculate_classification_accuracy(predictions, ground_truth):
    """Top-1 accuracy for category prediction"""
    pass

def calculate_mrr(ranked_results, relevant_items):
    """Mean Reciprocal Rank for search quality"""
    pass

def calculate_recall_at_k(ranked_results, relevant_items, k=5):
    """Recall@K metric"""
    pass
```

---

### 3. Organization Planning (LLM) Evaluation

**Locations:**
- `app/adapters/call_llm.py`
- `app/services/planning.py`

| Task | Priority | Evaluation Criteria | Status |
|------|----------|---------------------|--------|
| Create golden dataset (file → expected destination) | High | 50+ annotated files | ☐ |
| Implement destination accuracy metric | High | > 80% correct folder selection | ☐ |
| Implement rename quality evaluation | Medium | Human evaluation or rule-based | ☐ |
| Test confidence calibration | Medium | High confidence = high accuracy | ☐ |
| Measure hallucination rate | High | < 5% invalid destinations | ☐ |
| Test prompt injection resistance | Medium | No security bypasses | ☐ |
| A/B test different prompt templates | Low | Compare prompt variations | ☐ |

---

### 4. Duplicate Detection Evaluation

**Current Status:** Partially implemented in `ingestion.py` via SHA-256 hash

| Task | Priority | Evaluation Criteria | Status |
|------|----------|---------------------|--------|
| Implement exact duplicate detection (hash-based) | High | 100% precision for byte-identical | ✅ |
| Implement near-duplicate detection (embedding-based) | High | Precision > 95%, Recall > 80% | ☐ |
| Create test dataset with known duplicates | High | Mix of exact and near-duplicates | ☐ |
| Define similarity threshold | Medium | Empirically determine optimal threshold | ☐ |
| Handle false positives gracefully | Medium | User confirmation for near-duplicates | ☐ |
| Measure performance on large file sets | Low | < 1s per file for hash check | ☐ |

---

### 5. Summary Generation Evaluation

**Current Status:** Placeholder in `planning.py` (only truncation, no actual LLM)

| Task | Priority | Evaluation Criteria | Status |
|------|----------|---------------------|--------|
| Implement actual LLM summarization | High | Use LLM instead of truncation | ☐ |
| Implement ROUGE metrics | High | ROUGE-L > 0.3 | ☐ |
| Human evaluation for summary quality | Medium | 4+/5 average rating | ☐ |
| Test summary length control | Medium | Within specified word limits | ☐ |
| Test factual consistency | High | No hallucinated facts | ☐ |

---

## 🔄 File Organization Issues & Recommendations

### Current Duplication Issues

#### Issue 1: PDF Text Extraction - Duplicated in 3 places

| File | Function |
|------|----------|
| `app/adapters/call_llm.py` | `extract_text_from_pdf()` |
| `app/services/rag.py` | `extract_text_from_pdf()` |
| `app/adapters/ollama_vlm.py` | VLM-based extraction |

**Recommendation:** Consolidate into `app/adapters/extraction/pdf.py`

#### Issue 2: Embedding Generation - Split across files

| File | Function |
|------|----------|
| `app/services/rag.py` | `text_to_embedding()`, `bytes_to_deterministic_vector()` |
| `app/services/hybrid_search.py` | `text_to_vector_with_fallback()` |

**Recommendation:** Consolidate into `app/adapters/embedding/`

#### Issue 3: LanceDB Connection - Duplicated logic

| File | Function |
|------|----------|
| `app/services/rag.py` | `find_db_dir()` |
| `app/services/hybrid_search.py` | `find_db_dir()`, `load_table()` |

**Recommendation:** Consolidate into `app/adapters/lancedb/connection.py`

#### Issue 4: Hardcoded Model Name

In `app/adapters/call_llm.py`:
```python
llm = OllamaLLM(model="qwen3-vl:2b")  # Hardcoded!
```

**Recommendation:** Use `settings.MODEL_NAME` like in `ollama_vlm.py`

---

### Proposed Directory Reorganization

```
app/
├── adapters/
│   ├── llm/
│   │   ├── __init__.py
│   │   ├── base.py              # Abstract LLM interface
│   │   ├── ollama.py            # Merge call_llm + ollama_vlm
│   │   └── prompts/             # Prompt templates
│   │       ├── organize.txt
│   │       ├── summarize.txt
│   │       └── classify.txt
│   ├── embedding/
│   │   ├── __init__.py
│   │   ├── base.py              # Abstract embedding interface
│   │   └── sentence_transformer.py
│   └── extraction/
│       ├── __init__.py
│       ├── pdf.py               # Consolidate all PDF extraction
│       ├── text.py              # Plain text extraction
│       └── vlm.py               # VLM-based universal extraction
├── services/
│   ├── ingestion.py             # Keep as-is
│   ├── planning.py              # Keep as-is
│   ├── search.py                # Merge rag.py + hybrid_search.py
│   └── evaluation/              # NEW: Evaluation utilities
│       ├── __init__.py
│       ├── metrics.py           # CER, WER, ROUGE, MRR, etc.
│       └── benchmark.py         # Benchmarking harness
```

---

## 📊 Test Datasets to Create

| Dataset | Purpose | Size | Format |
|---------|---------|------|--------|
| `ocr_ground_truth/` | OCR accuracy testing | 20+ documents | file + expected_text.txt |
| `classification_labels/` | Category classification | 100+ files | JSON with labels |
| `duplicate_pairs/` | Duplicate detection | 30+ pairs | JSON with relationships |
| `organize_golden/` | End-to-end organize | 50+ files | JSON with expected destinations |
| `summary_reference/` | Summary quality | 20+ documents | file + reference_summary.txt |

---

## 📐 Evaluation Metrics to Implement

```python
"""app/services/evaluation/metrics.py"""

def character_error_rate(predicted: str, ground_truth: str) -> float:
    """Calculate CER using Levenshtein distance."""
    # Use python-Levenshtein or similar
    pass

def word_error_rate(predicted: str, ground_truth: str) -> float:
    """Calculate WER."""
    pass

def classification_accuracy(predictions: list[str], labels: list[str]) -> float:
    """Top-1 accuracy."""
    correct = sum(1 for p, l in zip(predictions, labels) if p == l)
    return correct / len(labels) if labels else 0.0

def mean_reciprocal_rank(ranked_results: list[list[str]], relevant: list[str]) -> float:
    """Calculate MRR for search results."""
    pass

def recall_at_k(ranked_results: list[str], relevant: list[str], k: int = 5) -> float:
    """Calculate Recall@K."""
    pass

def rouge_l(predicted: str, reference: str) -> float:
    """ROUGE-L F1 score."""
    # Use rouge_score package
    pass

def confidence_calibration(predictions: list[dict]) -> dict:
    """Check if confidence scores are well-calibrated."""
    # Group by confidence bins, calculate accuracy per bin
    pass
```

---

## 🚀 Implementation Priority

### Week 1-2 (High Priority)
- [ ] Create ground truth test datasets
- [ ] Consolidate duplicate code (extraction, embedding)
- [ ] Implement basic metrics (accuracy, CER, WER)
- [ ] Fix hardcoded model names
- [ ] Move prompts to separate template files

### Week 3-4 (Medium Priority)
- [ ] Implement actual LLM summarization
- [ ] Add near-duplicate detection (embedding-based)
- [ ] Create evaluation benchmark harness
- [ ] Implement search quality metrics (MRR, Recall@K)

### Week 5+ (Low Priority)
- [ ] A/B testing framework for prompts
- [ ] Multi-language document support
- [ ] Advanced calibration metrics
- [ ] Performance optimization
- [ ] Caching layer for embeddings

---

## ✅ Acceptance Criteria Summary

| Feature | Metric | Target |
|---------|--------|--------|
| OCR Extraction | CER | < 5% |
| OCR Extraction | WER | < 10% |
| Classification | Top-1 Accuracy | > 85% |
| Search | MRR | > 0.8 |
| Search | Recall@5 | > 90% |
| Organization | Destination Accuracy | > 80% |
| Organization | Hallucination Rate | < 5% |
| Duplicate (exact) | Precision | 100% |
| Duplicate (near) | Precision | > 95% |
| Duplicate (near) | Recall | > 80% |
| Summary | ROUGE-L | > 0.3 |

---

## 📝 Notes

- All evaluation should be automated where possible
- Human evaluation required for subjective quality (summary, rename quality)
- Consider creating a CI pipeline for regression testing
- Log all model outputs for debugging and improvement
- Version control the test datasets separately from code