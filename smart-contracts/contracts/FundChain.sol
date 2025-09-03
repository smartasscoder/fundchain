// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FundChain is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    struct Campaign {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        bool active;
        bool funded;
    }
    
    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }
    
    Counters.Counter private _campaignIds;
    Counters.Counter private _contributionIds;
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Contribution[]) public campaignContributions;
    mapping(address => uint256[]) public userContributions;
    
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string name, uint256 goal);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event CampaignFunded(uint256 indexed campaignId, uint256 totalRaised);
    event CampaignClosed(uint256 indexed campaignId);
    
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= _campaignIds.current(), "Campaign does not exist");
        _;
    }
    
    modifier campaignActive(uint256 _campaignId) {
        require(campaigns[_campaignId].active, "Campaign is not active");
        _;
    }
    
    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external returns (uint256) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");
        
        _campaignIds.increment();
        uint256 newCampaignId = _campaignIds.current();
        
        campaigns[newCampaignId] = Campaign({
            id: newCampaignId,
            creator: msg.sender,
            name: _name,
            description: _description,
            goal: _goal,
            raised: 0,
            deadline: block.timestamp + (_durationInDays * 1 days),
            active: true,
            funded: false
        });
        
        emit CampaignCreated(newCampaignId, msg.sender, _name, _goal);
        return newCampaignId;
    }
    
    function contribute(uint256 _campaignId) external payable campaignExists(_campaignId) campaignActive(_campaignId) nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign deadline has passed");
        require(msg.value > 0, "Contribution amount must be greater than 0");
        
        campaign.raised += msg.value;
        
        _contributionIds.increment();
        uint256 contributionId = _contributionIds.current();
        
        Contribution memory newContribution = Contribution({
            contributor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });
        
        campaignContributions[_campaignId].push(newContribution);
        userContributions[msg.sender].push(_campaignId);
        
        emit ContributionMade(_campaignId, msg.sender, msg.value);
        
        // Check if campaign goal is reached
        if (campaign.raised >= campaign.goal && !campaign.funded) {
            campaign.funded = true;
            emit CampaignFunded(_campaignId, campaign.raised);
        }
    }
    
    function closeCampaign(uint256 _campaignId) external campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator || msg.sender == owner(), "Only creator or owner can close campaign");
        require(campaign.active, "Campaign is already closed");
        
        campaign.active = false;
        emit CampaignClosed(_campaignId);
    }
    
    function getCampaign(uint256 _campaignId) external view campaignExists(_campaignId) returns (
        address creator,
        string memory name,
        string memory description,
        uint256 goal,
        uint256 raised,
        uint256 deadline,
        bool active,
        bool funded
    ) {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.name,
            campaign.description,
            campaign.goal,
            campaign.raised,
            campaign.deadline,
            campaign.active,
            campaign.funded
        );
    }
    
    function getCampaignContributions(uint256 _campaignId) external view campaignExists(_campaignId) returns (Contribution[] memory) {
        return campaignContributions[_campaignId];
    }
    
    function getUserContributions(address _user) external view returns (uint256[] memory) {
        return userContributions[_user];
    }
    
    function getTotalCampaigns() external view returns (uint256) {
        return _campaignIds.current();
    }
    
    function withdrawFunds(uint256 _campaignId) external campaignExists(_campaignId) nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator can withdraw funds");
        require(campaign.funded, "Campaign is not funded yet");
        require(campaign.active, "Campaign is closed");
        
        uint256 amountToWithdraw = campaign.raised;
        campaign.raised = 0;
        campaign.active = false;
        
        payable(msg.sender).transfer(amountToWithdraw);
    }
}
