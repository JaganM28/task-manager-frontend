// Filepath: src/components/TaskModal.jsx (Definitive Final Version)

import React, { useState, useEffect } from 'react';
import commentService from '../services/commentService';
import taskService from '../services/taskService';

const modalBackdropStyles = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
};

const modalContentStyles = {
    backgroundColor: '#f4f5f7', padding: '24px', borderRadius: '8px',
    width: '90%', maxWidth: '768px', maxHeight: '90vh', overflowY: 'auto',
    position: 'relative' 
};

const closeButtonStyles = {
    position: 'absolute', top: '16px', right: '16px', background: 'none',
    border: 'none', fontSize: '1.5rem', cursor: 'pointer',
};

function TaskModal({ task, onClose, onTaskUpdate }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isCommentLoading, setIsCommentLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState(task.status);

    useEffect(() => {
        setIsCommentLoading(true);
        commentService.getCommentsForTask(task.id)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch comments", error);
            })
            .finally(() => {
                setIsCommentLoading(false);
            });
    }, [task.id]);

    // THIS IS THE CORRECT, WORKING FUNCTION
    const handleAddComment = () => {
        if (newComment.trim()) {
            commentService.addCommentToTask(task.id, { content: newComment })
                .then(response => {
                    // Add the new comment to the top of the list for a better UX
                    setComments(prevComments => [response.data, ...prevComments]);
                    setNewComment(''); // Clear the input field
                })
                .catch(error => {
                    console.error("Failed to add comment:", error);
                    alert("Could not add comment. Please try again.");
                });
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await taskService.updateTaskStatus(task.id, newStatus);
            onTaskUpdate(response.data);
            setCurrentStatus(newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Could not update task status.");
            setCurrentStatus(task.status);
        }
    };

    if (!task) return null;

    return (
        <div style={modalBackdropStyles} onClick={onClose}>
            <div style={modalContentStyles} onClick={e => e.stopPropagation()}>
                <button style={closeButtonStyles} onClick={onClose}>&times;</button>
                <h2>{task.title}</h2>

                <div className="status-selector" style={{marginBottom: '16px'}}>
                    <label htmlFor="status" style={{fontWeight: 'bold', marginRight: '8px'}}>Status:</label>
                    <select
                        id="status"
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        style={{padding: '8px', borderRadius: '4px'}}
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
                
                <p><strong>Description:</strong> {task.description || 'No description provided.'}</p>
                <hr />

                <h3>Comments</h3>
                <div className="add-comment-section" style={{marginBottom: '20px'}}>
                    <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        style={{width: '100%', minHeight: '60px', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc'}}
                    />
                    <button onClick={handleAddComment} style={{marginTop: '8px'}}>Save Comment</button>
                </div>

                <div className="comments-section">
                    {isCommentLoading ? <p>Loading comments...</p> : (
                        comments.length > 0 ? comments.map(comment => (
                            <div key={comment.id} style={{borderTop: '1px solid #ddd', padding: '12px 0'}}>
                                <strong>{comment.authorUsername}</strong> <span style={{fontSize: '0.8em', color: 'gray'}}>{new Date(comment.createdAt).toLocaleString()}</span>
                                <p style={{marginTop: '4px', marginBottom: '0'}}>{comment.content}</p>
                            </div>
                        )) : <p>No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskModal;