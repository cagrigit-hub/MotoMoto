import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import EAddress from "../constants/EAddress";


describe("Payment", function () {
    async function deployFixture(){
        const [owner, addr1, addr2] = await ethers.getSigners();
        const Payment = await ethers.getContractFactory("Payment");
        const payment = await Payment.deploy();
        const FakeERC20 = await ethers.getContractFactory("FakeERC20");
        const fakeERC20 = await FakeERC20.deploy(1000000);
   
        const paymentAddr = await payment.getAddress();
        const fakeERC20addr = await fakeERC20.getAddress();
        return { payment, owner, addr1, addr2, fakeERC20, paymentAddr, fakeERC20addr }
    }
    describe("Deployment", async function(){
        it("should deploy correctly", async function(){
            const { payment } = await loadFixture(deployFixture);
            expect(await payment.owner()).to.not.equal(ethers.ZeroAddress);
        })
        it("Should set the right owner", async function(){
            const { payment, owner } = await loadFixture(deployFixture);
            expect(await payment.owner()).to.equal(owner.address);
        })
    })
    describe("Withdraw from contract", async function(){
        it("should withdraw correctly ERC20", async function(){
            const { payment, fakeERC20, paymentAddr, fakeERC20addr, addr1 } = await loadFixture(deployFixture);
            await fakeERC20.transfer(paymentAddr, 1000);
            const balanceBefore = await fakeERC20.balanceOf(addr1.address);
            await payment.withdraw(fakeERC20addr, addr1.address);
            const balanceAfter = await fakeERC20.balanceOf(addr1.address);
            expect(balanceAfter - balanceBefore).to.equal(1000);
        })
        it("should withdraw correctly ETH", async function(){
            const { payment, paymentAddr, addr1, owner } = await loadFixture(deployFixture);
            const balanceBefore = await addr1.provider.getBalance(owner.address);
            await addr1.sendTransaction({
                to: paymentAddr,
                value: ethers.parseEther("1")
            })
            await payment.withdraw(EAddress, owner.address);
            const balanceAfter = await addr1.provider.getBalance(owner.address);
            // expect balance nearly 1 ETH
            expect(balanceAfter -  balanceBefore).to.be.closeTo(ethers.parseEther("1"), ethers.parseEther("0.01"));
        })
        it("should revert if not owner", async function(){
            const { payment, addr1 } = await loadFixture(deployFixture);
            await expect(payment.connect(addr1).withdraw(EAddress, addr1.address)).to.be.revertedWithCustomError(payment,"OnlyOwner");
        })
        it("should revert if not enough balance", async function(){
            const { payment, addr1 } = await loadFixture(deployFixture);
            await expect(payment.withdraw(EAddress, addr1.address)).to.be.revertedWithCustomError(payment,"NoBalance");
        })
        it("should revert if paused", async function(){
            const { payment, addr1 } = await loadFixture(deployFixture);
            await payment.pause();
            await expect(payment.withdraw(EAddress, addr1.address)).to.be.revertedWith("Pausable: paused");
        })
    })
    describe("Fees", async function(){
        it("should get fee correctly", async function(){
            const { payment } = await loadFixture(deployFixture);
            expect(await payment.getFee()).to.equal(700);
        })
        it("should set fee correctly", async function(){
            const { payment } = await loadFixture(deployFixture);
            await payment.setFee(500);
            expect(await payment.getFee()).to.equal(500);
        })
        it("should revert if not owner trying to set", async function(){
            const { payment, addr1 } = await loadFixture(deployFixture);
            await expect(payment.connect(addr1).setFee(500)).to.be.revertedWithCustomError(payment,"OnlyOwner");
        })
        it("should revert if Fee is bigger than 1500", async function(){
            const { payment } = await loadFixture(deployFixture);
            await expect(payment.setFee(1501)).to.be.revertedWithCustomError(payment,"FeeLimit");
        })
    })
    describe("Pay", async function(){
        it("should pay correctly", async function(){
            const { payment, fakeERC20, owner,addr1, addr2, fakeERC20addr, paymentAddr } = await loadFixture(deployFixture);
            await fakeERC20.transfer(addr1.address, 1000);
            await fakeERC20.connect(addr1).approve(paymentAddr, 1000);
            await payment.connect(addr1).pay(addr2.address, fakeERC20addr, 1000);
            // default fee is 700
            expect(await fakeERC20.balanceOf(addr2.address)).to.equal(930);
        })
        it("should revert if not enough balance", async function(){
            const { payment, addr1, addr2, fakeERC20addr } = await loadFixture(deployFixture);
            await expect(payment.connect(addr1).pay(addr2.address, fakeERC20addr, 1000)).to.be.revertedWithCustomError(payment,"NoBalance");
        })
        it("should revert if not enough allowance", async function(){
            const { payment, fakeERC20, addr1, addr2, fakeERC20addr, paymentAddr } = await loadFixture(deployFixture);
            await fakeERC20.transfer(addr1.address, 1000);
            await expect(payment.connect(addr1).pay(addr2.address, fakeERC20addr, 1000)).to.be.revertedWithCustomError(payment,"NoBalance");
        })
        it("should revert if paused", async function(){
            const { payment, fakeERC20, addr1, addr2, fakeERC20addr, paymentAddr } = await loadFixture(deployFixture);
            await fakeERC20.transfer(addr1.address, 1000);
            await fakeERC20.connect(addr1).approve(paymentAddr, 1000);
            await payment.pause();
            await expect(payment.connect(addr1).pay(addr2.address, fakeERC20addr, 1000)).to.be.revertedWith("Pausable: paused");
        })
        it("should get correct fee", async function(){
            const { payment, fakeERC20, addr1, addr2, fakeERC20addr, paymentAddr } = await loadFixture(deployFixture);
            // change fee
            await payment.setFee(500);
            await fakeERC20.transfer(addr1.address, 1000);
            await fakeERC20.connect(addr1).approve(paymentAddr, 1000);
            await payment.connect(addr1).pay(addr2.address, fakeERC20addr, 1000);
            // default fee is 500
            expect(await fakeERC20.balanceOf(addr2.address)).to.equal(950);
        })
    })
    describe("Pause", async function(){
        it("should pause correctly", async function(){
            const { payment, owner } = await loadFixture(deployFixture);
            await payment.pause();
            expect(await payment.paused()).to.equal(true);
        })
        it("should revert if not owner", async function(){
            const { payment, addr1 } = await loadFixture(deployFixture);
            await expect(payment.connect(addr1).pause()).to.be.revertedWithCustomError(payment,"OnlyOwner");
        })
        it("should revert if already paused", async function(){
            const { payment } = await loadFixture(deployFixture);
            await payment.pause();
            await expect(payment.pause()).to.be.revertedWith("Pausable: paused");
        })
    })
    describe("Unpause", async function(){
        it("should unpause correctly", async function(){
            const { payment, owner } = await loadFixture(deployFixture);
            await payment.pause();
            await payment.unpause();
            expect(await payment.paused()).to.equal(false);
        })
        it("should revert if not owner", async function(){
            const { payment, addr1 } = await loadFixture(deployFixture);
            // pause first
            await payment.pause();
            await expect(payment.connect(addr1).unpause()).to.be.revertedWithCustomError(payment,"OnlyOwner");
        })
        it("should revert if not paused", async function(){
            const { payment } = await loadFixture(deployFixture);
            await expect(payment.unpause()).to.be.revertedWith("Pausable: not paused");
        })
    })
    describe("Change owner", async function(){
        it("should change owner correctly", async function(){
            const { payment, owner, addr1 } = await loadFixture(deployFixture);
            await payment.connect(owner).changeOwner(addr1.address);
            expect(await payment.owner()).to.equal(addr1.address);
        })
        it("should revert if not owner", async function(){
            const { payment, addr1, addr2 } = await loadFixture(deployFixture);
            await expect(payment.connect(addr1).changeOwner(addr2.address)).to.be.revertedWithCustomError(payment,"OnlyOwner");
        })
    });
});