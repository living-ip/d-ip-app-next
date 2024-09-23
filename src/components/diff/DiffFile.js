import React from 'react';
import DiffLine from './DiffLine';

const DiffFile = ({ hunks }) => (
  <div className="mb-4 border rounded-lg overflow-hidden">
    {hunks.map((hunk, index) => (
      <div key={index} className="border-t border-gray-200 first:border-t-0">
        {hunk.changes.map((change, changeIndex) => (
          <DiffLine key={changeIndex} type={change.type} content={change.content} />
        ))}
      </div>
    ))}
  </div>
);

export default DiffFile;
