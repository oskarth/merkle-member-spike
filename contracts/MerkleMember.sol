// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract MerkleMember is ReentrancyGuard {

//    constructor(uint256 joinFee) {
//        uint256 public immutable joinFee;
//    }

    uint256 public joinFee = 1;
    uint32 public immutable levels;
    bytes32[] public filledSubtrees;
    bytes32[] public zeros;
    uint32 public currentRootIndex = 0;
    uint32 public nextIndex = 0;
    bytes32 public root;
    //XXX
    uint256 public constant ZERO_VALUE = 0;
    // keccak("foo")?
    //uint256 public constant ZERO_VALUE =
    //    21663839004416932945382355908790599225266501822907911457504978515578255421292; // = keccak256("tornado") % FIELD_SIZE

    event Join(bytes32 leaf, uint32 leafIndex, uint256 timestamp);

    //constructor(uint32 _treeLevels, address _hasher) {
    constructor() {
        //require(_treeLevels > 0, "_treeLevels should be greater than zero");
        //require(_treeLevels < 32, "_treeLevels should be less than 32");

        uint32 _treeLevels = 20;
        levels = _treeLevels;

        bytes32 currentZero = bytes32(ZERO_VALUE);
        //These identical
        zeros.push(currentZero);
        filledSubtrees.push(currentZero);

        // We fill up the tree
        for (uint32 i = 1; i < _treeLevels; i++) {
            currentZero = keccak256(abi.encodePacked(currentZero, currentZero));
            zeros.push(currentZero);
            filledSubtrees.push(currentZero);
        }

        //roots[0] = abi.encodePacked(currentZero, currentZero);
        root = keccak256(abi.encodePacked(currentZero, currentZero));
    }


    function verify(
        bytes32[] memory proof,
        bytes32 _root,
        bytes32 leaf
    ) public pure returns (bool) {
        return MerkleProof.verify(proof, _root, leaf);
    }

    function _processJoin() internal {
        require(msg.value == joinFee,
                "Please send `joinFee` ETH along with transaction");
    }

    function _insert(bytes32 _leaf) internal returns (uint32 index) {
        console.log("*** _insert");

        uint32 currentIndex = nextIndex;
        require(
            currentIndex != uint32(2)**levels,
            "Merkle tree is full. No more leafs can be added"
        );
        nextIndex += 1;
        // Setting current level hash to value of leaf
        bytes32 currentLevelHash = _leaf;
        bytes32 left;
        bytes32 right;

        // XXX What is this right.
        for (uint32 i = 0; i < levels; i++) {
            if (currentIndex % 2 == 0) {
                left = currentLevelHash;
                right = zeros[i];

                filledSubtrees[i] = currentLevelHash;
            } else {
                left = filledSubtrees[i];
                right = currentLevelHash;
            }

            // XXX
            //currentLevelHash = hashLeftRight(left, right);
            currentLevelHash = keccak256(abi.encodePacked(left, right));

            currentIndex /= 2;
        }

        // Skip root history
        //currentRootIndex = (currentRootIndex + 1) % ROOT_HISTORY_SIZE;
        //roots[currentRootIndex] = currentLevelHash;
        root = currentLevelHash;
        return nextIndex - 1;
    }


    function join(bytes32 leaf) external payable nonReentrant {
        console.log("*** In join");
        console.logBytes32(leaf);

        // Interesting, with these three statements commented out
        // It prints the leaf hash
        uint32 insertedIndex = _insert(leaf);
        // XXX: Send join fee
        //_processJoin();

        emit Join(leaf, insertedIndex, block.timestamp);
    }
}
