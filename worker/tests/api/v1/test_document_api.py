"""Tests for the document ingestion and search API (RAG-Anything)."""
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from app.main import app


client = TestClient(app)


@patch("app.services.rag.ingest_document", new_callable=AsyncMock, return_value={"status": "ok", "file_path": "/path/to/file"})
def test_ingest_document(mock_ingest):
    """Test the /documents/ingest endpoint."""
    response = client.post(
        "/documents/ingest",
        json={"file_path": "/path/to/file.pdf"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    mock_ingest.assert_called_once()


@patch("app.services.rag.query_rag", new_callable=AsyncMock, return_value="The document is about cooking.")
def test_search_documents(mock_query):
    """Test the /documents/search endpoint."""
    response = client.post(
        "/documents/search",
        json={"query": "What is the document about?", "mode": "hybrid"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "The document is about cooking."
    assert data["mode"] == "hybrid"
    mock_query.assert_called_once()
