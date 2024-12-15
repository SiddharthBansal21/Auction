let auctionContract;
let signer;
let auctionDurationInput;
let bidAmountInput;
let auctionEndTimeDisplay;
let highestBidDisplay;
let highestBidderDisplay;

async function connectWallet() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const contractAddress = "0x72097AEAA5F90fdA4F33124EAf9F478505B5C898"; // Replace with your contract address
        const abi =[
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "AuctionEnded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					}
				],
				"name": "AuctionStarted",
				"type": "event"
			},
			{
				"inputs": [],
				"name": "bid",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "endAuction",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "bidder",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"name": "HighestBidIncreased",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_biddingTime",
						"type": "uint256"
					}
				],
				"name": "startAuction",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "withdraw",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "auctionEndTime",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "ended",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "highestBid",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "highestBidder",
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
				"inputs": [],
				"name": "owner",
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
						"name": "",
						"type": "address"
					}
				],
				"name": "pendingReturns",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		];

        auctionContract = new ethers.Contract(contractAddress, abi, signer);
        auctionDurationInput = document.getElementById("auctionDuration");
        bidAmountInput = document.getElementById("bidAmount");
        auctionEndTimeDisplay = document.getElementById("auctionEndTime");
        highestBidDisplay = document.getElementById("highestBid");
        highestBidderDisplay = document.getElementById("highestBidder");

        document.getElementById("wallet-connect").style.display = "none";
        document.getElementById("auction-details").style.display = "block";
    } else {
        alert("Please install MetaMask to connect your wallet.");
    }
}

async function startAuction() {
    const duration = parseInt(auctionDurationInput.value);
    if (isNaN(duration) || duration <= 0) {
        alert("Please enter a valid auction duration.");
        return;
    }

    await auctionContract.startAuction(duration);
    alert("Auction started!");
}

async function placeBid() {
    const bidAmount = ethers.utils.parseEther(bidAmountInput.value);
    await auctionContract.bid({ value: bidAmount });
    alert("Bid placed!");
}

async function endAuction() {
    await auctionContract.endAuction();
    alert("Auction ended!");
}

async function withdraw() {
    const success = await auctionContract.withdraw();
    if (success) {
        alert("Withdrawal successful!");
    } else {
        alert("Withdrawal failed!");
    }
}

async function updateAuctionDetails() {
    const auctionEndTime = await auctionContract.auctionEndTime();
    const highestBid = await auctionContract.highestBid();
    const highestBidder = await auctionContract.highestBidder();

    auctionEndTimeDisplay.textContent = new Date(auctionEndTime * 1000).toLocaleString();
    highestBidDisplay.textContent = ethers.utils.formatEther(highestBid);
    highestBidderDisplay.textContent = highestBidder || "None";
}
