pragma solidity ^0.5.1;
import "D:/LICENTA/code/blockchain/contracts/Organ.sol";
import "D:/LICENTA/code/blockchain/contracts/Liver.sol";

contract PatientContract{
    
    enum OrganType {Liver, Heart}
    OrganType public organType;
    
    string public identifier;
    address public owner;
    bool public donor;
	bool public receiver;

     //map with doctors
    mapping(address => bool) public doctors;
    address[] public myDoctors;
    uint public numberOfMyDoctors;
	
    mapping(string => address) public organs;
    
    //mapping with IPFShash -> document name
    mapping(string => string) public documents;
    string[] public ipfs;
    uint public numberOfIpfs;
    
    //constants
    string liver = "LIVER";
    string heart = "HEART";
    
	//trusted person
    address trustedPerson;
    
    struct Request{
        string timestampReceived;
        string timestampApproved;
        address approvedBy;
        string status;
        string fileHash;
        string fileName;
    }
    
    //requests
    //mapping with doctor contract address concat with filehash -> struct request
    //PROBLEM!!!!!dont forget
    mapping(string => Request) public requests;
    string[] public requestsArray;
    uint public numberOfRequests;
	
    function register(string memory _identifier) public {
        owner = msg.sender;
        identifier = _identifier;
    }
    
    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
       
         
    function addDoctorToPatientMap(address _doctorContractAddress, bool value) public {
        doctors[_doctorContractAddress] = value;    
        myDoctors.push(_doctorContractAddress);
        numberOfMyDoctors++;
    }
    
    function addOrganToMap(string memory _organ) public returns(bool){
        require(doctors[msg.sender] == true, "Doctor is not in map.");
		bool liverResult = compareStrings(_organ, liver);
        if(liverResult == true) {
            Liver l = new Liver();
            organs[_organ] = address(l); 
            return true;
        }else{
            bool heartResult = compareStrings(_organ, heart);
            if(heartResult == true){
                return false;
            }else return false;
        }
    }
    
    function getOrganByName(string memory _organ) view public returns(address){
        return organs[_organ];
    }
    
    function addNewDocument(string memory _ipfsHash, string memory _documentName) public{
        require(doctors[msg.sender] == true || msg.sender == owner || msg.sender == trustedPerson, "Person not allowed to perform this operation.");
		documents[_ipfsHash] = _documentName;
        ipfs.push(_ipfsHash);
        numberOfIpfs++;
    }
	
	function markPatientAsDonor() public {
        require(doctors[msg.sender] == true, "Doctor is not in map.");
        donor = true;
    }

    function markPatientAsReceiver() public {
        require(doctors[msg.sender] == true, "Doctor is not in map.");
        receiver = true;
    }
    
    function setTrustedPerson(address _personAddress) public{
        require(msg.sender == owner, "Person not allowed to do this operation.");
        trustedPerson = _personAddress;
    }
    
    function getTrustedPerson() view external returns (address person) {
        return trustedPerson;
    }
    
    function createRequest(string memory _mapKey,string memory _timestampReceived, string memory _fileHash, string memory _fileName) public{
        require(doctors[msg.sender] == true, "Doctor is not in map.");
        address defaultAddress = 0xb853198d539F48f2D705AE9273d023C9874C742f;
        requests[_mapKey] = Request(_timestampReceived, "null",defaultAddress,"PENDING",_fileHash,_fileName);
        requestsArray.push(_mapKey);
        numberOfRequests++;
    } 
    
    function approveRequest(string memory _mapKey, string memory _approvedTimestamp, address _approvedBy) public{
        require(_approvedBy == owner || _approvedBy == trustedPerson, "Person not allowed to perform this operation.");
        Request storage req = requests[_mapKey];
        req.timestampApproved = _approvedTimestamp;
        req.approvedBy = _approvedBy;
        req.status = "APPROVED";
    }
}
