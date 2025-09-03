const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundChain", function () {
  let FundChain;
  let fundChain;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    FundChain = await ethers.getContractFactory("FundChain");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    fundChain = await FundChain.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await fundChain.owner()).to.equal(owner.address);
    });

    it("Should start with 0 campaigns", async function () {
      expect(await fundChain.getTotalCampaigns()).to.equal(0);
    });
  });

  describe("Campaign Creation", function () {
    it("Should create a campaign successfully", async function () {
      const campaignName = "Test Campaign";
      const description = "Test Description";
      const goal = ethers.utils.parseEther("10");
      const duration = 30;

      await fundChain.createCampaign(campaignName, description, goal, duration);
      
      const campaign = await fundChain.getCampaign(1);
      expect(campaign.name).to.equal(campaignName);
      expect(campaign.creator).to.equal(owner.address);
      expect(campaign.goal).to.equal(goal);
      expect(campaign.active).to.be.true;
    });

    it("Should fail to create campaign with 0 goal", async function () {
      await expect(
        fundChain.createCampaign("Test", "Desc", 0, 30)
      ).to.be.revertedWith("Goal must be greater than 0");
    });

    it("Should fail to create campaign with 0 duration", async function () {
      await expect(
        fundChain.createCampaign("Test", "Desc", ethers.utils.parseEther("10"), 0)
      ).to.be.revertedWith("Duration must be greater than 0");
    });
  });

  describe("Contributions", function () {
    beforeEach(async function () {
      await fundChain.createCampaign("Test Campaign", "Test Description", ethers.utils.parseEther("10"), 30);
    });

    it("Should accept contributions", async function () {
      const contributionAmount = ethers.utils.parseEther("1");
      
      await fundChain.connect(addr1).contribute(1, { value: contributionAmount });
      
      const campaign = await fundChain.getCampaign(1);
      expect(campaign.raised).to.equal(contributionAmount);
    });

    it("Should fail to contribute 0 amount", async function () {
      await expect(
        fundChain.connect(addr1).contribute(1, { value: 0 })
      ).to.be.revertedWith("Contribution amount must be greater than 0");
    });
  });

  describe("Campaign Management", function () {
    beforeEach(async function () {
      await fundChain.createCampaign("Test Campaign", "Test Description", ethers.utils.parseEther("10"), 30);
    });

    it("Should allow creator to close campaign", async function () {
      await fundChain.closeCampaign(1);
      
      const campaign = await fundChain.getCampaign(1);
      expect(campaign.active).to.be.false;
    });

    it("Should allow owner to close campaign", async function () {
      await fundChain.connect(owner).closeCampaign(1);
      
      const campaign = await fundChain.getCampaign(1);
      expect(campaign.active).to.be.false;
    });

    it("Should not allow non-creator/non-owner to close campaign", async function () {
      await expect(
        fundChain.connect(addr1).closeCampaign(1)
      ).to.be.revertedWith("Only creator or owner can close campaign");
    });
  });
});
