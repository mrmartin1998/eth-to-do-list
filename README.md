# Ethereum To-Do List dApp

## Description

The Ethereum To-Do List dApp allows users to create and manage their to-do list on the Ethereum blockchain. Users can add tasks, mark them as completed, and view their tasks in real-time.

## Technologies Used

- Solidity (Smart Contract Development)
- HTML/CSS/JavaScript (Front-end)
- Truffle (Development Framework)
- Ganache (Local Blockchain for Testing)
- Web3.js (Library for Interacting with the Ethereum Network)

## Smart Contract

The smart contract (ToDoList.sol) is responsible for storing tasks on the Ethereum blockchain. It includes functions to add tasks, get task details, update task status, and delete tasks.

## Front-End

The front-end consists of an `index.html` file and an `app.js` file. The HTML provides the user interface, while the JavaScript code interacts with the smart contract and updates the UI based on the blockchain data.

## Installation

To run the dApp locally, follow these steps:

1. Clone this repository to your local machine.
2. Install Truffle and Ganache to set up a local blockchain environment.
3. Compile and deploy the smart contract to the local blockchain.
4. Update the `contractAddress` variable in the `app.js` file with the deployed contract address.

## Usage

1. Open the `index.html` file in a web browser.
2. Connect your Metamask wallet to the dApp (make sure you have some test Ether on the local blockchain).
3. Enter a task in the input field and click the "Add" button to add it to your to-do list.
4. Once a task is completed, click the checkbox next to it to mark it as completed. The task will move to the "Completed" list.
5. To delete a task, click the delete icon next to it in the "Tasks" or "Completed" list.

## Contributions

Contributions to the project are welcome! If you want to contribute, please fork this repository, make your changes, and submit a pull request.
