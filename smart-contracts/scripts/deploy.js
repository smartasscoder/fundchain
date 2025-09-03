const hre = require("hardhat");

async function main() {
  console.log("Deploying FundChain contract...");

  const FundChain = await hre.ethers.getContractFactory("FundChain");
  const fundChain = await FundChain.deploy();

  await fundChain.deployed();

  console.log("FundChain deployed to:", fundChain.address);
  console.log("Contract owner:", await fundChain.owner());
  
  // Save deployment info
  const deploymentInfo = {
    contractName: "FundChain",
    address: fundChain.address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };
  
  console.log("Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
