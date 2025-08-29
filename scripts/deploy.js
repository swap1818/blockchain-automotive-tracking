const hre = require("hardhat");

async function main() {
  const Traceability = await hre.ethers.getContractFactory("AutomotiveTraceability");
  const traceability = await Traceability.deploy();

  await traceability.deployed();

  console.log(`✅ Contract deployed at address: ${traceability.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error during deployment:", error);
    process.exit(1);
  });
