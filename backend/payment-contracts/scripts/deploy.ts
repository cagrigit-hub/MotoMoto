import { ethers } from "hardhat";

async function main() {


  const payment = await ethers.deployContract("Payment");

  await payment.waitForDeployment();

  console.log(
    `deployed to ${payment.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
