// Filepath: src/pages/DashboardPage.jsx (Definitive Final Version)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import workspaceService from '../services/workspaceService';
import Navbar from '../components/Navbar';
import ItemCreator from '../components/ItemCreator';

const dashboardStyles = {
    padding: '20px',
};

const workspaceGridStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '20px',
    alignItems: 'flex-start',
};

const workspaceTileStyles = {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    minWidth: '200px',
    position: 'relative', 
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.2s',
};

const workspaceLinkStyles = {
    display: 'block',
    padding: '30px 40px',
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
};

const deleteButtonStyles = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#aaa',
    padding: '4px',
    lineHeight: '1',
    borderRadius: '50%',
    transition: 'background-color 0.2s, color 0.2s',
    zIndex: 2, 
};

function DashboardPage() {
    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await workspaceService.getMyWorkspaces();
                setWorkspaces(response.data);
            } catch (err) {
                setError('Failed to fetch workspaces. Please try logging in again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkspaces();
    }, []);
    const handleCreateWorkspace = async (workspaceData) => { 
        try {
            const response = await workspaceService.createWorkspace(workspaceData);
            setWorkspaces(prevWorkspaces => [...prevWorkspaces, response.data]);
        } catch (error) {
            console.error("Failed to create workspace:", error);
            alert("Could not create workspace. Please try again.");
        }
    };
    const handleDeleteWorkspace = async (workspaceId) => {
        if (window.confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
            try {
                await workspaceService.deleteWorkspace(workspaceId);
                setWorkspaces(prevWorkspaces => prevWorkspaces.filter(ws => ws.id !== workspaceId));
            } catch (error) {
                console.error("Failed to delete workspace:", error);
                alert(error.response?.data?.message || "Could not delete workspace. You might not be the owner.");
            }
        }
     };

    if (isLoading) return <div>Loading...</div>;
    if (error) return ( <div> <Navbar /> <div style={{padding: '20px', color: 'red'}}>{error}</div> </div> );

    return (
        <div>
            <Navbar />
            <div style={dashboardStyles}>
                <h2>Your Workspaces</h2>
                <div style={workspaceGridStyles}>
                    {workspaces.map(ws => (
                        <div 
                            key={ws.id} 
                            style={workspaceTileStyles}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 1px rgba(0,0,0,0.1)'}
                        >
                            <Link to={`/workspace/${ws.id}`} style={workspaceLinkStyles}>
                                {ws.name}
                            </Link>
                            <button
                                style={deleteButtonStyles}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#dcdcdc';
                                    e.currentTarget.style.color = '#333';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#aaa';
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteWorkspace(ws.id);
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <ItemCreator itemType="workspace" onCreate={handleCreateWorkspace} />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;