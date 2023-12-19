// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDoList {
    // Defining a structure to store a task
    struct Task {
        string task;
        bool isDone;
    }

    mapping (address => Task[]) private Users;

    // Defining function to add a task
    function addTask(string calldata _task) external {
        Users[msg.sender].push(Task({
            task: _task,
            isDone: false
        }));

        // Emit an event for task addition
        emit TaskAdded(msg.sender, Users[msg.sender].length - 1, _task, false);
    }

    // Defining a function to get details of a task
    function getTask(uint256 _taskIndex) external view returns (Task memory) {
        Task storage task = Users[msg.sender][_taskIndex];
        return task;
    }

    // Defining a function to update status of a task
    function updateStatus(uint256 _taskIndex, bool _status) external {
        Users[msg.sender][_taskIndex].isDone = _status;

        // Emit an event for task completion
        emit TaskCompleted(msg.sender, _taskIndex, Users[msg.sender][_taskIndex].task, _status);
    }

    // Defining a function to delete a task
    function deleteTask(uint256 _taskIndex) external {
        delete Users[msg.sender][_taskIndex];
    }

    // Defining a function to get task count.
    function getTaskCount() external view returns (uint256) {
        return Users[msg.sender].length;
    }

    // Defining events for task addition and completion
    event TaskAdded(address indexed user, uint256 indexed taskIndex, string task, bool isDone);
    event TaskCompleted(address indexed user, uint256 indexed taskIndex, string task, bool isDone);
}
