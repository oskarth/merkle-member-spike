async function deployContract() {
  MerkleMember = await ethers.getContractFactory("MerkleMember");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  deployedMerkleMember = await MerkleMember.deploy();

  return deployedMerkleMember;
}

(async () => {
  try {
    const contract = await deployContract();
    console.log("Contract address is: %s", contract.address);
  } catch(err) {
    console.error("Error", err);
  }
})()
