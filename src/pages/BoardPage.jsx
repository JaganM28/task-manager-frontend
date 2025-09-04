// Filepath: src/pages/BoardPage.jsx 

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import ItemCreator from '../components/ItemCreator';
import TaskModal from '../components/TaskModal';
import boardService from '../services/boardService';
import taskService from '../services/taskService';

const boardContainerStyles = {
  display: 'flex', padding: '20px', height: 'calc(100vh - 90px)',
  overflowX: 'auto', alignItems: 'flex-start', backgroundColor: '#ffffffde',
};

function BoardPage() {
    const { workspaceId } = useParams();
    const [boardData, setBoardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const boardResponse = await boardService.getBoardsForWorkspace(workspaceId);
            const boardsAsColumns = boardResponse.data;
            const taskPromises = boardsAsColumns.map(board => taskService.getTasksForBoard(board.id));
            const tasksResponses = await Promise.all(taskPromises);
            const tasks = {};
            const columns = {};
            tasksResponses.forEach((response, index) => {
                const boardId = boardsAsColumns[index].id;
                response.data.forEach(task => { tasks[String(task.id)] = task; });
                columns[String(boardId)] = {
                    id: String(boardId),
                    title: boardsAsColumns[index].name,
                    taskIds: response.data.map(task => String(task.id)),
                };
            });
            const formattedData = {
                tasks: tasks, columns: columns,
                columnOrder: boardsAsColumns.map(b => String(b.id)),
            };
            setBoardData(formattedData);
        } catch (err) {
            setError('Failed to fetch board data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [workspaceId]);

    const handleAddBoard = async (newBoardData) => {
        try {
            const response = await boardService.createBoard(workspaceId, newBoardData);
            const newBoard = response.data;
            setBoardData(prevData => ({
                ...prevData,
                columns: {
                    ...prevData.columns,
                    [String(newBoard.id)]: { id: String(newBoard.id), title: newBoard.name, taskIds: [] }
                },
                columnOrder: [...prevData.columnOrder, String(newBoard.id)]
            }));
        } catch (error) { alert("Could not add board."); }
    };

    const handleAddTask = async (columnId, taskData) => {
        try {
            const response = await taskService.createTask(columnId, taskData);
            const newTask = response.data;
            setBoardData(prevData => {
                const newTasks = { ...prevData.tasks, [String(newTask.id)]: newTask };
                const newColumn = { ...prevData.columns[columnId] };
                newColumn.taskIds.push(String(newTask.id));
                const newColumns = { ...prevData.columns, [columnId]: newColumn };
                return { ...prevData, tasks: newTasks, columns: newColumns };
            });
        } catch (error) { alert("Could not add task."); }
    };

    const handleDeleteBoard = async (boardId) => {
        try {
            await boardService.deleteBoard(workspaceId, boardId);
            setBoardData(prevData => {
                const newColumns = { ...prevData.columns };
                const tasksToDelete = newColumns[boardId].taskIds;
                delete newColumns[boardId];
                const newTasks = { ...prevData.tasks };
                tasksToDelete.forEach(taskId => delete newTasks[taskId]);
                const newColumnOrder = prevData.columnOrder.filter(id => id !== boardId);
                return { tasks: newTasks, columns: newColumns, columnOrder: newColumnOrder };
            });
        } catch (error) { alert("Could not delete board."); }
    };

    const handleDeleteTask = async (taskIdToDelete, boardId) => {
        const taskIdStr = String(taskIdToDelete);
        try {
            await taskService.deleteTask(taskIdToDelete);
            setBoardData(prevData => {
                const newTasks = { ...prevData.tasks };
                delete newTasks[taskIdStr];
                const column = prevData.columns[boardId];
                const newTaskIds = column.taskIds.filter(id => id !== taskIdStr);
                const newState = {
                    ...prevData,
                    tasks: newTasks,
                    columns: { ...prevData.columns, [boardId]: { ...column, taskIds: newTaskIds } }
                };
                return newState;
            });
        } catch (error) {
            alert("Could not delete task.");
            console.error("Deletion failed:", error);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setBoardData(prevData => ({
            ...prevData,
            tasks: { ...prevData.tasks, [String(updatedTask.id)]: updatedTask },
        }));
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }
        const startColumn = boardData.columns[source.droppableId];
        const finishColumn = boardData.columns[destination.droppableId];
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const finishTaskIds = (startColumn === finishColumn) ? startTaskIds : Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newState = {
            ...boardData,
            columns: {
                ...boardData.columns,
                [startColumn.id]: { ...startColumn, taskIds: startTaskIds },
                [finishColumn.id]: { ...finishColumn, taskIds: finishTaskIds },
            },
        };
        setBoardData(newState);
        taskService.moveTask(draggableId, destination.droppableId)
            .catch(err => {
                console.error("Failed to save task move:", err);
                alert("Could not save task move. Reverting changes.");
                fetchData();
            });
    };

    if (isLoading) return <div>Loading board...</div>;
    if (error) return ( <div><Navbar /><div style={{padding: '20px', color: 'red'}}>{error}</div></div> );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f5f7' }}>
            <Navbar />
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={boardContainerStyles}>
                    {boardData?.columnOrder.map(columnId => {
                        const column = boardData.columns[columnId];
                        const tasks = column.taskIds.map(taskId => boardData.tasks[taskId]);
                        return (
                            <Column
                                key={column.id}
                                column={column}
                                tasks={tasks.filter(Boolean)}
                                onAddTask={handleAddTask}
                                onTaskClick={setSelectedTask}
                                onDeleteTask={handleDeleteTask}
                                onDeleteBoard={handleDeleteBoard}
                            />
                        );
                    })}
                    <ItemCreator itemType="list" onCreate={handleAddBoard} />
                </div>
            </DragDropContext>
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onTaskUpdate={handleTaskUpdate}
                />
            )}
        </div>
    );
}

export default BoardPage;