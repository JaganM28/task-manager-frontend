// Filepath: src/components/ItemCreator.jsx 

import React, { useState } from 'react';

const creatorStyles = {
    padding: '20px 40px',
    backgroundColor: 'rgba(0, 0, 0, 0.03)', 
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#5e6c84',
    minWidth: '150px',
    textAlign: 'center',
    fontWeight: 'bold',
    border: '2px dashed #dcdcdc', 
    height: 'fit-content',
    transition: 'background-color 0.2s, border-color 0.2s',
};

const formStyles = {
    backgroundColor: '#f0f0f0',
    padding: '8px',
    borderRadius: '8px',
};

const inputStyles = {
    width: '100%',
    border: '2px solid #0079BF',
    borderRadius: '3px',
    padding: '8px',
    marginBottom: '8px',
    boxSizing: 'border-box',
};

const buttonStyles = {
    backgroundColor: '#0079BF',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
};

function ItemCreator({ itemType, onCreate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (title.trim()) {
      onCreate({ name: title });
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div style={{...creatorStyles, ...formStyles, border: 'none'}}>
        <input
          style={inputStyles}
          placeholder={`Enter a title for this ${itemType}...`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <button style={buttonStyles} onClick={handleCreate}>Add {itemType}</button>
        <button onClick={() => setIsAdding(false)} style={{...buttonStyles, backgroundColor: 'transparent', color: '#5e6c84', marginLeft: '8px'}}>Cancel</button>
      </div>
    );
  }

  return (
    <div 
        style={creatorStyles} 
        onClick={() => setIsAdding(true)}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.07)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'}
    >
      + Add another {itemType}
    </div>
  );
}

export default ItemCreator;