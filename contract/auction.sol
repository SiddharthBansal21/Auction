// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    address public owner;
    address public highestBidder;
    uint public highestBid;
    uint public auctionEndTime;
    bool public ended;

    mapping(address => uint) public pendingReturns;

    event AuctionStarted(uint endTime);
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    modifier auctionNotEnded() {
        require(!ended, "Auction has already ended.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Set auction end time after the auction starts
    function startAuction(uint _biddingTime) external onlyOwner {
        require(auctionEndTime == 0, "Auction already started.");

        auctionEndTime = block.timestamp + _biddingTime;
        emit AuctionStarted(auctionEndTime);
    }

    modifier auctionActive() {
        require(block.timestamp < auctionEndTime, "Auction has ended.");
        _;
    }

    // Place a bid
    function bid() external payable auctionActive {
        require(msg.value > highestBid, "There already is a higher bid.");

        if (highestBid != 0) {
            // Refund the previous highest bidder
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    // Withdraw overbid amounts
    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    // End the auction (can be done anytime by the owner, even before the auction end time)
    function endAuction() external onlyOwner auctionNotEnded {
        require(block.timestamp >= auctionEndTime, "Auction time has not ended.");

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // Transfer the highest bid to the owner
        payable(owner).transfer(highestBid);
    }
}
