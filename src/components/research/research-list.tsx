"use client";
import { useState } from "react";

type Paper = {
  id: string | number;
  title: string;
  description?: string;
  downloadUrl?: string;
};

export default function ResearchList() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [query, setQuery] = useState("Search papers......");
  const [loading, setLoading] = useState(false);

  const searchResearch = async () => {
    setLoading(true);
    const res = await fetch(`/api/research?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setPapers((data.data || []) as Paper[]);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-bold  mb-10 mt-10 text-2xl">Over 200+mil Research Papers</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a topic"
        className="border-1  border-b-amber-100 p-2 rounded-full  mb-4"
      />
      <button
        className="border-1 p-2  mx-5 bg-gray-600 rounded-full"
        onClick={searchResearch}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}

      <div style={{ marginTop: "20px" }}>
        {papers.length > 0
          ? papers.map((paper) => (
              <div
                key={paper.id}
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                }}
              >
                <h2>{paper.title}</h2>
                <p>{paper.description}</p>
                {paper.downloadUrl && (
                  <a
                    href={paper.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read Full Paper
                  </a>
                )}
              </div>
            ))
          : !loading && <p>No research papers found. Try another keyword.</p>}
      </div>
    </div>
  );
}
