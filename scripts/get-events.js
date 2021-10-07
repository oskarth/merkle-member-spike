const keccak256 = require('keccak256');

const Contract = ethers.Contract;


// TODO get join events

// TODO
let abi = [
  "event Join(bytes32 leaf, uint32 leafIndex, uint256 timestamp)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();

  let address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  let contract = new Contract(address, abi, provider)

  // TODO
  var filter = contract.filters.Join()
  // Oryou could pass in a parameter to the above call to filter by node, sine it is indexed,
  // let filter = ens.filters.Transfer(ethers.utils.namehash("ricmoo.firefly.eth"));

  // Now you can specify fromBlock and toBlock (you may pass in promises; no need to await)
  filter.fromBlock = provider.getBlockNumber().then((b) => b - 50000);
  filter.toBlock = "latest";

  console.log("filter", filter);

  // And query:
  provider.getLogs(filter).then((logs) => {
    console.log(logs);
  });
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
