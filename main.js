


AOS.init();
const ContractABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32[]",
        "name": "proposalNames",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "authenticator",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "giveRightToVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "proposals",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "name",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "proposal",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "vote",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "anyvotes",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "winningName",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "winningName_",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "winningProposal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "winningProposal_",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
// import ContractABI from "./contractABI.js";
function useState(defaultValue) {
    let value = defaultValue
  
    function getValue() {
      return value
    }
  
    function setValue(newValue) {
      value = newValue
    }
  
    return [getValue, setValue];
  }

   // stored the states here
   const [connected, setConnected] = useState(false);
   const [address, setAddress] = useState("");

   const connectButton = document.getElementById('connectButton');
 
   // a function to connect wallet
   const handleConnectMetamask = async () => {
     // used the try block just so i can catch errors easily
     try {
       // declared the provider here to search for window.ethereum
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       // make a request to connect network
       await provider.send("eth_requestAccounts", []);
       // declared signer
       const signer = await provider.getSigner();
       // chainId of the connected network
       const chainId = await signer.getChainId();
 
       // we have a conditional block here that says if the user chainID isn't equal to that of the the Mumbai Network
       if (chainId !== "0x13881") {
         try {
           // make a request to change the connected chain
           await provider.send("wallet_switchEthereumChain", [
             { chainId: `0x13881` },
           ]);
         } catch (error) {
           // catcch error block
           console.error("Error requesting account switch:", error);
           return;
         }
       }
 
       // a constant to get address
       const address = await signer.getAddress();
       // use the slice method to truncate address
       const truncatedAddress = address.slice(0, 4) + ".." + address.slice(-2);
       console.log(connectButton)
       connectButton.innerHTML = `Connected: ${truncatedAddress}`;

       // set signer
       setConnected(signer);
       // set connected address
       setAddress(truncatedAddress);
     } catch (error) {
       // catch error
       console.log("Error Connecting: ", error);
     }
   };

   //USeSNackbar component in vanilla javascript 
   function useSnackbar() {
    const snackbarContainer = document.createElement("div");
    snackbarContainer.classList.add("snackbar-container");
    document.body.appendChild(snackbarContainer);
  
    function enqueueSnackbar(message, options = {}) {
      const snackbar = document.createElement("div");
      snackbar.classList.add("snackbar");
      snackbar.textContent = message;
      
      if (options.variant) {
        snackbar.classList.add(`snackbar-${options.variant}`);
      }
      
      snackbarContainer.appendChild(snackbar);
      
      setTimeout(() => {
        snackbarContainer.removeChild(snackbar);
      }, options.duration || 3000);
    }
  
    return {
      enqueueSnackbar,
    };
  }

   

  //The use snackbar component in js

  
    const { enqueueSnackbar } = useSnackbar();
    const contractAddress = "0x5CDf21c8072cDe0677e98BAD170d297C63a40cB1";
  
    const [value, setValue] = useState("");
  
    const handleInput = () => {
      const inputValue = document.querySelector("#proposal").value;
      setValue(inputValue);
      console.log(inputValue);
    };
  
    const winningCandidate = async () => {
    
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        
        const votingContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );
        console.log( votingContract)
        const winningName = await votingContract.winningName();
        console.log(winningName)
        const convertByte = ethers.utils.parseBytes32String(winningName);
  
        alert(convertByte);
        enqueueSnackbar(convertByte + " Project Is Leading", {
          variant: "success",
        });
      } catch (error) {
        console.log("Error Message: ", error.data);
      }
    };

    const voteCandidate = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        const votingContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );
        console.log(votingContract)
        
        const voterInfo = await votingContract.voters(address);
        const hasVoted = voterInfo.anyvotes;
        console.log(hasVoted);
  
        if (hasVoted) {
          console.log("Already voted");
        } else {
          // Process the vote
          console.log("Voting...");
        }
  
        // Proceed with voting
        const transaction = await votingContract.vote(value);
  
        let receipt = await wait(transaction);
        console.log(receipt)
        console.log("Vote submitted successfully!");
        enqueueSnackbar("Vote Successful", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error.data, { variant: "error" });
        console.log("Failed, reason: ", error.data);
      }
    };