import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * A lightweight, local Vector Store for RAG-based worker matching.
 * Supports dense Google GenAI embeddings with a robust TF-IDF fallback vector model.
 */
class LocalVectorStore {
  constructor() {
    this.documents = []; // Array of { id, text, metadata, embedding }
  }

  // Tokenize and clean text for TF-IDF fallback
  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  // Compute Term Frequency vector
  _getTF(tokens) {
    const tf = {};
    tokens.forEach((t) => {
      tf[t] = (tf[t] || 0) + 1;
    });
    return tf;
  }

  // Cosine Similarity of sparse frequency maps
  _sparseCosineSimilarity(tfA, tfB) {
    const allKeys = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    allKeys.forEach((key) => {
      const valA = tfA[key] || 0;
      const valB = tfB[key] || 0;
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    });

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Cosine Similarity of dense float arrays
  _denseCosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Fetch embedding from Gemini API
  async _getGeminiEmbedding(text) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      if (result?.embedding?.values) {
        return result.embedding.values;
      }
    } catch (err) {
      console.warn("Failed to retrieve Gemini embedding, defaulting to TF-IDF:", err.message);
    }
    return null;
  }

  /**
   * Adds documents to the vector store.
   * Chunks them and computes embeddings (dense or sparse).
   * @param {Array<{id: string, text: string, metadata: object}>} docs 
   */
  async addDocuments(docs) {
    for (const doc of docs) {
      const textClean = doc.text.trim();
      const tokens = this._tokenize(textClean);
      const tf = this._getTF(tokens);

      let embedding = null;
      if (process.env.GEMINI_API_KEY) {
        embedding = await this._getGeminiEmbedding(textClean);
      }

      this.documents.push({
        id: doc.id,
        text: textClean,
        metadata: doc.metadata || {},
        tf,
        embedding,
      });
    }
  }

  /**
   * Performs a similarity search query over the stored vectors.
   * @param {string} queryText 
   * @param {number} topK 
   * @returns {Promise<Array<{document: object, score: number}>>}
   */
  async similaritySearch(queryText, topK = 5) {
    const queryTokens = this._tokenize(queryText);
    const queryTF = this._getTF(queryTokens);

    let queryEmbedding = null;
    if (process.env.GEMINI_API_KEY) {
      queryEmbedding = await this._getGeminiEmbedding(queryText);
    }

    const results = this.documents.map((doc) => {
      let score = 0;
      if (queryEmbedding && doc.embedding) {
        score = this._denseCosineSimilarity(queryEmbedding, doc.embedding);
      } else {
        score = this._sparseCosineSimilarity(queryTF, doc.tf);
      }
      return { doc, score };
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => ({
        id: item.doc.id,
        text: item.doc.text,
        metadata: item.doc.metadata,
        score: item.score,
      }));
  }

  clear() {
    this.documents = [];
  }
}

export const vectorStore = new LocalVectorStore();
