const keccak256 = require('keccak256');

const Contract = ethers.Contract;


// TODO get join events

// TODO
let abi = [
  "event Join(bytes32 leaf, uint32 leafIndex, uint256 timestamp)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();

  // Or use contracts factory here?
  let address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  let contract = new Contract(address, abi, provider)

  var filter = contract.filters.Join()
  var blockNumber = await provider.getBlockNumber();
  filter.fromBlock = 0;
  filter.toBlock = "latest";

  console.log("filter", filter);

  var logs = await provider.getLogs(filter);
  console.log(logs);

  let iface = new ethers.utils.Interface(abi);
  logs.forEach((log) => {
    console.log(iface.parseLog(log));
  });

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
