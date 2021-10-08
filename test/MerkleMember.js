const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { ethers } = require("hardhat");
const { expect } = require('chai');

let abi = [
  "event Join(bytes32 leaf, uint32 leafIndex, uint256 timestamp)"
];

describe("Merkle member contract", function () {

  let MerkleMember;
  let deployedMerkleMember;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    MerkleMember = await ethers.getContractFactory("MerkleMember");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    console.log("Before each, deploy contract");
    deployedMerkleMember = await MerkleMember.deploy();
  });

  describe("Verification", function () {

    it("returns true for a valid Merkle proof", async function () {
      const elements =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('');
      const merkleTree = new MerkleTree(elements,
                                        keccak256,
                                        { hashLeaves: true, sortPairs: true });

      const root = merkleTree.getHexRoot();

      const leaf = keccak256(elements[0]);

      const proof = merkleTree.getHexProof(leaf);

      expect(await deployedMerkleMember.verify(proof, root, leaf)).to.equal(true);

    });

    it('returns false for an invalid Merkle proof', async function () {
      const correctElements = ['a', 'b', 'c'];
      const correctMerkleTree = new MerkleTree(correctElements,
                                               keccak256,
                                               { hashLeaves: true, sortPairs: true });

      const correctRoot = correctMerkleTree.getHexRoot();

      const correctLeaf = keccak256(correctElements[0]);

      const badElements = ['d', 'e', 'f'];
      const badMerkleTree = new MerkleTree(badElements);

      const badProof = badMerkleTree.getHexProof(badElements[0],
                                                 keccak256,
                                                 { hashLeaves: true, sortPairs: true });

      expect(await deployedMerkleMember.verify(badProof,
                                               correctRoot,
                                               correctLeaf)).to.equal(false);
    });

    it('returns false for a Merkle proof of invalid length', async function () {
      const elements = ['a', 'b', 'c'];
      const merkleTree = new MerkleTree(elements,
                                        keccak256,
                                        { hashLeaves: true, sortPairs: true });

      const root = merkleTree.getHexRoot();

      const leaf = keccak256(elements[0]);

      const proof = merkleTree.getHexProof(leaf);
      const badProof = proof.slice(0, proof.length - 5);

      expect(await deployedMerkleMember.verify(badProof, root, leaf)).to.equal(false);
    });

  });

  describe("Join", function() {

    it("returns event after joining", async function () {
      // TODO insert
      // TODO requires money
      console.log("join");
      // Trying to join with some random leaf entry
      const leaf = keccak256("test");
      //expect(await deployedMerkleMember.join(leaf)).to.equal(true);

      // Don't know args?
      await expect(deployedMerkleMember.join(leaf))
        .to.emit(deployedMerkleMember, 'Join');
      //        .withArgs(leaf, 1, 2);


      //const [owner] = await ethers.getSigners();
      // Is this a different provider?
      //const provider = new ethers.providers.JsonRpcProvider();
      const provider = ethers.provider;

      //var filter = contract.filters.Join()
      var filter = deployedMerkleMember.filters.Join()

      var blockNumber = await provider.getBlockNumber();
      //filter.fromBlock = blockNumber - 50000;
      filter.fromBlock = 0;
      //filter.fromBlock = provider.getBlockNumber().then((b) => b - 50000);
      filter.toBlock = "latest";

      console.log("filter", filter);

      // And query:
      // TODO Fix exit before done async
      var logs = await provider.getLogs(filter);
      console.log("*** event logs", logs);

      // Finally we get logs! Have to parse first.
      let iface = new ethers.utils.Interface(abi);

      logs.forEach((log) => {
        console.log(iface.parseLog(log));
      });

    });

  });

});
