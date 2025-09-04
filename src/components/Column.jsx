// Filepath: src/components/Column.jsx 

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';  
import Task from './Task';

const columnStyles = {
  margin: '8px', display: 'flex', flexDirection: 'column', width: '272px',
  backgroundColor: '#f7f7f7ff',
  color: '#ffffffff',
  borderRadius: '8px', 
  height: 'fit-content',
  boxShadow: '0 1px 1px rgba(0,0,0,0.1)', 
};

const titleStyles = {
    padding: '10px 12px', fontWeight: 'bold', color: '#172B4D',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};
const taskListStyles = { padding: '8px', transition: 'background-color 0.2s ease', flexGrow: 1, minHeight: '100px' };
const addTaskButtonStyles = {
    padding: '8px', margin: '0 8px 8px 8px', textAlign: 'left',
    backgroundColor: 'transparent', border: 'none',
    cursor: 'pointer', color: '#5e6c84', borderRadius: '3px',
};
const addTaskFormStyles = { padding: '8px' };
const textAreaStyles = {
    width: '100%', border: 'none', resize: 'none',
    padding: '8px', borderRadius: '3px',
    boxSizing: 'border-box', marginBottom: '8px'
};

function Column({ column, tasks, onAddTask, onTaskClick, onDeleteTask, onDeleteBoard }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(column.id, { title: newTaskTitle });
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div style={columnStyles}>
      <div style={titleStyles}>
        <span>{column.title}</span>
        <span 
            onClick={() => {
                if(window.confirm(`Are you sure you want to delete the list: "${column.title}"? This will also delete all its tasks.`)) {
                    onDeleteBoard(column.id)
                }
            }}
            style={{cursor: 'pointer', fontSize: '1.2rem', color: '#6b778c'}}
        >
            ...
        </span>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ ...taskListStyles, backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent' }}
          >
            {tasks.map((task, index) => (
              <Task 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={onTaskClick} 
                onDelete={() => onDeleteTask(task.id, column.id)} 
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {isAdding ? (
        <div style={addTaskFormStyles}>
            <textarea
                style={textAreaStyles}
                placeholder="Enter a title for this card..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                autoFocus
            />
            <button onClick={handleAddTask}>Add card</button>
            <button onClick={() => setIsAdding(false)} style={{backgroundColor: 'transparent', color: '#5e6c84', width: 'auto', marginLeft: '8px'}}>Cancel</button>
        </div>
      ) : (
        <button style={addTaskButtonStyles} onClick={() => setIsAdding(true)}>+ Add a card</button>
      )}
    </div>
  );
}

export default Column;