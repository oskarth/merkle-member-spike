const keccak256 = require('keccak256');

const Contract = ethers.Contract;

let abi = [
  "function join(bytes32 leaf)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();

  let address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  let contract = new Contract(address, abi, provider.getSigner())

  // TODO Use public key here
  const leaf = keccak256("test");
  var resp = await contract.join(leaf);

  console.log("Join response", resp);
  console.log("Leaf", leaf.toString("hex"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
