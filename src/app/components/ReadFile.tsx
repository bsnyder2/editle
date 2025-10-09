// src/components/ReadFile.tsx
import React, { useState, useEffect } from 'react';

const ReadFile: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);
  console.log("here");

  useEffect(() => {
    // Fetch file content when the component mounts
    const fetchContent = async () => {
      const res = await fetch('/api/read-file');
      const data = await res.json();

      const rawContent: string = data.content
      const words = rawContent.split('\n');
      console.log("DATA:" + words.length);



      setContent(data.content);
    };
    fetchContent();

  }, []); // Empty array means it runs only once when the component mounts

  return (
    <div>
      <h1>File Contezzznt</h1>
      {/* If content exists, display; otherwise display loading */}
      {content ? (
        <pre>{content}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ReadFile;