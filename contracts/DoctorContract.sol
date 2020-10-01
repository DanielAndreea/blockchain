pragma solidity ^0.5.1;


contract DoctorContract{
    
    enum Specialization {Neurology, Pediatrics, Surgery, Urology}
    Specialization public specialization;
     
    address public owner;
    string public firstName;
    string public lastName;
    uint256 public age;
    
      struct Request{
        string requested;
        string timestampApproved;
        string status;
        string fileHash;
        string fileName;
    }

    //requests
    //mapping with doctor contract address concat with filehash -> struct request
    mapping(string => Request) public requests;
    string[] public requestsArray;
    uint public numberOfRequests;

    //map with consulted patients
    mapping(address => address) public consultedPatients;
    address[] public patientsArray;
    uint public numberOfPatients = 0;

    event consultedPatient(address accountAddress);

    function register(string memory _firstName, string memory _lastName, uint256 _age, uint _specialization) public {
        owner = msg.sender;
        firstName = _firstName;
        lastName = _lastName;
        age = _age;
        specialization = Specialization(_specialization);
    }

    function consultPatient(address  _patientAccountAddress, address  _patientContractAddress) public{
        consultedPatients[_patientAccountAddress] = _patientContractAddress;
        patientsArray.push(_patientAccountAddress);
        numberOfPatients++;
    }

    function getConsultedPatient(address _patientAccountAddress) view public returns(address contractAddress){
        return consultedPatients[_patientAccountAddress];
    }

    function createRequest(string memory _mapKey,string memory _requested, string memory _fileHash, string memory _fileName) public{
        requests[_mapKey] = Request(_requested, "null","PENDING",_fileHash,_fileName);
        requestsArray.push(_mapKey);
        numberOfRequests++;
    }

    function approveRequest(string memory _mapKey, string memory _approvedTimestamp) public {
        Request storage req = requests[_mapKey];
        req.timestampApproved = _approvedTimestamp;
        req.status = "APPROVED";
    }
}