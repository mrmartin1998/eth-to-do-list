window.addEventListener('load', async () => {
  if (window.ethereum) {
      try {
          // Request user's permission to interact with the Ethereum network
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          window.ethereumAddress = accounts[0];
          window.web3 = new Web3(window.ethereum);
      } catch (error) {
          console.error('User denied account access:', error);
          alert('You need to allow MetaMask.');
          return;
      }
  } else {
      alert('Web3 is not detected. Please install MetaMask or use a compatible browser to use this dApp.');
      return;
  }

  window.ethereum.on('accountsChanged', (accounts) => {
      window.ethereumAddress = accounts[0];
      loadTasks();
  });

  window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
  });

  
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
    const contractAddress = '0xf8703A5350C8C2670c594745F2cCd38A0eAF5130';
    const todoContract = new window.web3.eth.Contract(contractABI, contractAddress);

    async function addTask() {
        const taskInput = document.getElementById('taskInput').value;
        if (taskInput.trim() === '') {
            alert('Please enter a valid task.');
            return;
        }
        try {
            await todoContract.methods.addTask(taskInput).send({ from: window.ethereumAddress });
            const taskCount = await todoContract.methods.getTaskCount().call({ from: window.ethereumAddress });
            const taskAddedEvent = new CustomEvent('taskAdded', { detail: { task: taskInput, taskIndex: taskCount - 1 }});
            document.dispatchEvent(taskAddedEvent);
            window.location.reload();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async function updateStatus(taskIndex, status) {
        try {
            await todoContract.methods.updateStatus(taskIndex, status).send({ from: window.ethereumAddress });
            window.location.reload();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }

    async function loadTasks() {
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
                checkbox.addEventListener('change', function () { updateStatus(i, this.checked); });
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

    document.addEventListener('taskAdded', function (event) {
        const task = event.detail.task;
        const taskIndex = event.detail.taskIndex;
        const taskList = document.getElementById('taskList');
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = false;
        checkbox.addEventListener('change', function () { updateStatus(taskIndex, this.checked); });
        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(task));
        taskList.appendChild(listItem);
    });

    document.getElementById('addButton').onclick = addTask;
    loadTasks();
});