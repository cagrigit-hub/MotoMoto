import { Payment } from "../typechain";
import { ethers } from "hardhat";
import x from "../../builded_contracts/artifacts/contracts/Payment.sol/Payment.json";
import EAddress from "../constants/EAddress";
async function main() {
    const wallet = new ethers.Wallet("f110e16ce9f3bd6ccbb56f982b0737f7c629711cfc703ee0f646743d987f0980", ethers.provider);
    const abi = x.abi;
    const payment = new ethers.Contract("0x2c8cF91a77879adFa249Da4d686B64D5f953c71b",abi , wallet) as unknown as Payment;
    const tx = await payment.pay("0x6A2D930A14203d01D76AB3E1C9601Db6e97a4D49", EAddress, ethers.parseEther("0.01") , { value: ethers.parseEther("0.01") });
    await tx.wait();
    console.log("done");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});