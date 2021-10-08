async function main() {
 var provider = new ethers.providers.JsonRpcProvider();

  MerkleMember = await ethers.getContractFactory("MerkleMember", provider.getSigner());

  contract = await MerkleMember.deploy();

  console.log("Contract address is: %s", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
