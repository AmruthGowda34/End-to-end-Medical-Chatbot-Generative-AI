from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
import threading
from typing import List

_embeddings = None
_embeddings_lock = threading.Lock()

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        with _embeddings_lock:
            if _embeddings is None:
                print("🔵 Loading HuggingFace Embeddings (one-time)...")
                _embeddings = HuggingFaceEmbeddings(
                    model_name="sentence-transformers/all-MiniLM-L6-v2"
                )
                vec = _embeddings.embed_query("test")
                print("🧩 Embedding dimension:", len(vec))
                print("🟢 Embeddings loaded successfully.")
    return _embeddings

def download_hugging_face_embeddings():
    return get_embeddings()

def load_pdf_file(data_path: str):
    loader = DirectoryLoader(data_path, glob="*.pdf", loader_cls=PyPDFLoader)
    return loader.load()

def filter_to_minimal_docs(docs: List[Document]) -> List[Document]:
    out = []
    for doc in docs:
        out.append(Document(page_content=doc.page_content, metadata={"source": doc.metadata.get("source")}))
    return out

def text_split(docs: List[Document]):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
    return splitter.split_documents(docs)
