// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

    event Join(bytes32 leaf, uint32 leafIndex, uint256 timestamp);

    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) public pure returns (bool) {
        return MerkleProof.verify(proof, root, leaf);
    }

    function _processJoin() internal {
        require(msg.value == joinFee,
                "Please send `joinFee` ETH along with transaction");
    }

    function _insert(bytes32 _leaf) internal returns (uint32 index) {
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

        uint32 insertedIndex = _insert(leaf);
        _processJoin();

        emit Join(leaf, insertedIndex, block.timestamp);
    }
}
