// Wait for the page to load before executing the JavaScript code
window.addEventListener('load', async () => {
    // Check if Web3 is available (Metamask injected Web3)
    if (typeof window.ethereum !== 'undefined') {
      // Create a Web3 instance
      window.web3 = new Web3(window.ethereum);
      // Request user's permission to interact with the Ethereum network
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Retrieve the user's selected Ethereum address
      const accounts = await window.web3.eth.getAccounts();
      window.ethereumAddress = accounts[0];
    } else {
      // Handle the case where Web3 is not available
      alert('Web3 is not detected. Please install Metamask or use a compatible browser to use this dApp.');
      return;
    }
  
    // Contract ABI (replace with your compiled contract's ABI)
    const contractABI = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "taskIndex",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "task",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isDone",
              "type": "bool"
            }
          ],
          "name": "TaskAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "taskIndex",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "task",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isDone",
              "type": "bool"
            }
          ],
          "name": "TaskCompleted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_task",
              "type": "string"
            }
          ],
          "name": "addTask",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_taskIndex",
              "type": "uint256"
            }
          ],
          "name": "getTask",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "task",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isDone",
                  "type": "bool"
                }
              ],
              "internalType": "struct ToDoList.Task",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_taskIndex",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "_status",
              "type": "bool"
            }
          ],
          "name": "updateStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_taskIndex",
              "type": "uint256"
            }
          ],
          "name": "deleteTask",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getTaskCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ];
  
    // Contract address (replace with the deployed contract's address on Ganache)
    const contractAddress = '0x795c3c037283CEC06bF2d3ECD047d587eFdE035e';
  
    // Initialize the contract instance
    const todoContract = new window.web3.eth.Contract(contractABI, contractAddress);
  
    // Function to add a task
    async function addTask() {
      const taskInput = document.getElementById('taskInput').value;
      if (taskInput.trim() === '') {
        alert('Please enter a valid task.');
        return;
      }
  
      try {
        await todoContract.methods.addTask(taskInput).send({ from: window.ethereumAddress });
        // Emit an event for task addition
        const taskCount = await todoContract.methods.getTaskCount().call({ from: window.ethereumAddress });
        const taskAddedEvent = new CustomEvent('taskAdded', {
          detail: {
            task: taskInput,
            taskIndex: taskCount - 1
          }
        });
        document.dispatchEvent(taskAddedEvent);
        // Refresh the page after adding the task
        window.location.reload();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  
    // Function to update the status of a task
    async function updateStatus(taskIndex, status) {
      try {
        await todoContract.methods.updateStatus(taskIndex, status).send({ from: window.ethereumAddress });
        // Refresh the page after updating the status
        window.location.reload();
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  
    // Function to load tasks from the smart contract
    async function loadTasks() {
      // Clear the task lists before loading
      const taskList = document.getElementById('taskList');
      const completedList = document.getElementById('completedList');
      taskList.innerHTML = '';
      completedList.innerHTML = '';
  
      try {
        const taskCount = await todoContract.methods.getTaskCount().call({ from: window.ethereumAddress });
  
        for (let i = 0; i < taskCount; i++) {
          const task = await todoContract.methods.getTask(i).call({ from: window.ethereumAddress });
          const listItem = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = task.isDone;
          checkbox.addEventListener('change', function () {
            updateStatus(i, this.checked);
          });
          listItem.appendChild(checkbox);
          listItem.appendChild(document.createTextNode(task.task));
          if (task.isDone) {
            completedList.appendChild(listItem);
          } else {
            taskList.appendChild(listItem);
          }
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  
    // Listen for the taskAdded event and update the UI accordingly
    document.addEventListener('taskAdded', function (event) {
      const task = event.detail.task;
      const taskIndex = event.detail.taskIndex;
      const taskList = document.getElementById('taskList');
      const listItem = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.addEventListener('change', function () {
        updateStatus(taskIndex, this.checked);
      });
      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(task));
      taskList.appendChild(listItem);
    });
  
    // Attach the addTask function to the "Add" button onclick event
    document.getElementById('addButton').onclick = addTask;
  
    // Load tasks when the page is ready
    loadTasks();
  });
  