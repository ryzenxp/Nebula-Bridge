const hre = require("hardhat");

async function main() {
  const TokenAddress = "0x..."; // The address of the token you want to vest
  const NebulaVesting = await hre.ethers.getContractFactory("NebulaVesting");
  const vesting = await NebulaVesting.deploy(TokenAddress);

  await vesting.deployed();

  console.log("Nebula Bridge Contract Deployed to:", vesting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
