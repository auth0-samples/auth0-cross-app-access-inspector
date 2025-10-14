import React, { useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('json', json);

interface JsonViewerProps {
  data: any;
  title?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, title }) => {
  const jsonString = JSON.stringify(data, null, 2);

  useEffect(() => {
    hljs.highlightAll();
  }, [data]);

  const highlighted = hljs.highlight(jsonString, { language: 'json' }).value;

  return (
    <div className="mt-4">
      {title && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      )}
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          <code
            className="language-json hljs"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
};
