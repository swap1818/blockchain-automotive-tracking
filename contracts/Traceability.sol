// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AutomotiveTraceability {
    struct TraceRecord {
        string vin;
        uint256 stationId;
        string testName;
        string value;
        uint256 timestamp;
        string status; // "Pass" or "Fail"
    }

    mapping(string => TraceRecord[]) private traceabilityLog;
    address public owner;

    event RecordAdded(
        string indexed vin,
        uint256 stationId,
        string testName,
        string value,
        uint256 timestamp,
        string status
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addTraceRecord(
        string memory _vin,
        uint256 _stationId,
        string memory _testName,
        string memory _value,
        string memory _status
    ) public onlyOwner {
        TraceRecord memory record = TraceRecord({
            vin: _vin,
            stationId: _stationId,
            testName: _testName,
            value: _value,
            timestamp: block.timestamp,
            status: _status
        });

        traceabilityLog[_vin].push(record);

        emit RecordAdded(_vin, _stationId, _testName, _value, block.timestamp, _status);
    }

    function getRecordsByVIN(string memory _vin) public view returns (TraceRecord[] memory) {
        return traceabilityLog[_vin];
    }
}
