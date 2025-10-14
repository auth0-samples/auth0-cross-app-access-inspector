import React, { useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import http from 'highlight.js/lib/languages/http';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('http', http);

interface HttpRequestViewerProps {
  content: string;
  title?: string;
}

export const HttpRequestViewer: React.FC<HttpRequestViewerProps> = ({ content, title }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, [content]);

  const highlighted = hljs.highlight(content, { language: 'http' }).value;

  return (
    <div className="mt-4">
      {title && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      )}
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          <code
            className="language-http hljs"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
};
