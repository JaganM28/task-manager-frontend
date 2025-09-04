// Filepath: src/components/Task.jsx 

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const statusColors = {
    TODO: '#ffebee',         // A light, soft red
    IN_PROGRESS: '#fff9c4',  // A light, soft yellow
    DONE: '#e8f5e9',         // A light, soft green
};

const taskStyles = {
    userSelect: 'none', padding: '10px', margin: '0 0 8px 0',
    color: '#172B4D', borderRadius: '3px',
    boxShadow: '0 1px 1px rgba(9,30,66,.25)', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
    borderLeft: '5px solid transparent', // Add a left border for the color accent
};
const deleteButtonStyles = {
    color: '#aaa', fontWeight: 'bold', cursor: 'pointer',
    padding: '4px', borderRadius: '3px', visibility: 'hidden',
};
const taskContainerStyles = { position: 'relative' };

function Task({ task, index, onClick, onDelete }) {
  
  const cardStyle = {
    ...taskStyles,
    backgroundColor: statusColors[task.status] || '#fff',
    borderLeftColor: task.status === 'TODO' ? '#e57373' : (task.status === 'IN_PROGRESS' ? '#fff176' : (task.status === 'DONE' ? '#81c784' : 'transparent')),
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...taskContainerStyles, ...provided.draggableProps.style }}
          onMouseEnter={(e) => e.currentTarget.querySelector('.delete-btn').style.visibility = 'visible'}
          onMouseLeave={(e) => e.currentTarget.querySelector('.delete-btn').style.visibility = 'hidden'}
        >
          <div 
            style={{
              ...cardStyle,
              ...(snapshot.isDragging && { backgroundColor: '#e6f7ff', borderLeftColor: '#4dabf5' }),
            }}
            onClick={() => onClick(task)}
          >
            <span>{task.title}</span>
            <span 
              className="delete-btn"
              style={deleteButtonStyles} 
              onClick={(e) => {
                e.stopPropagation();
                if(window.confirm(`Are you sure you want to delete the task: "${task.title}"?`)) {
                    onDelete();
                }
              }}
            >
              ×
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default React.memo(Task);