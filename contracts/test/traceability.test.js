const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutomotiveTraceability", function () {
  let contract;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Traceability = await ethers.getContractFactory("AutomotiveTraceability");
    contract = await Traceability.deploy();
    await contract.deployed();
  });

  it("should allow the owner to add a trace record", async function () {
    await contract.addTraceRecord(
      "1FADP3F25GL278941",
      5034,
      "Knuckle to Hub Torque Test",
      "95.5 Nm",
      "Pass"
    );

    const records = await contract.getRecordsByVIN("1FADP3F25GL278941");
    expect(records.length).to.equal(1);
    expect(records[0].testName).to.equal("Knuckle to Hub Torque Test");
    expect(records[0].status).to.equal("Pass");
  });

  it("should store multiple test records for the same VIN", async function () {
    await contract.addTraceRecord("VIN999", 5034, "Torque", "90 Nm", "Pass");
    await contract.addTraceRecord("VIN999", 5065, "Brake Leak Test", "0.30 bar", "Fail");

    const records = await contract.getRecordsByVIN("VIN999");
    expect(records.length).to.equal(2);
    expect(records[1].testName).to.equal("Brake Leak Test");
    expect(records[1].status).to.equal("Fail");
  });

  it("should restrict addTraceRecord to only owner", async function () {
    await expect(
      contract.connect(addr1).addTraceRecord(
        "VIN123",
        5034,
        "Alignment",
        "Toe out",
        "Fail"
      )
    ).to.be.revertedWith("Only owner can call this function.");
  });
});
