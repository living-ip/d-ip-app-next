import React from 'react';

const DiffLine = ({ type, content }) => {
  const bgColor = type === 'insert' ? 'bg-green-100' : type === 'delete' ? 'bg-red-100' : 'bg-gray-100';
  const textColor = type === 'insert' ? 'text-green-800' : type === 'delete' ? 'text-red-800' : 'text-gray-800';

  return (
    <div className={`${bgColor} ${textColor} px-4 py-1 font-mono text-sm whitespace-pre-wrap break-words`}>
      {type === 'insert' && '+ '}
      {type === 'delete' && '- '}
      {content}
    </div>
  );
};

export default DiffLine;
