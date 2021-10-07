async function main() {
  MerkleMember = await ethers.getContractFactory("MerkleMember");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  contract = await MerkleMember.deploy();

  console.log("Contract address is: %s", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
