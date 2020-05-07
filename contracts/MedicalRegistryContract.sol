pragma solidity ^0.5.1;

contract MedicalRegistry{
    

    struct Receiver{
        string timestamp;
        address doctorContract;
        uint score;
    }
    
    mapping(address => address) public allDoctors;
    address[] public doctors;
    uint public numberOfDoctors;
    
    //uint in map => timestamp for each patient 
    mapping(address => string) public donors;
    address[] public donorsContractAddresses;
    uint public numberOfDonors;
    
    mapping(address => Receiver) public receivers; //liver
    address[] public receiversContractAddresses;
    uint public numberOfReceivers;
    
    
    function markPatientAsDonor(address _contractAddress, string memory _timestamp) public {
        donors[_contractAddress] = _timestamp;
        donorsContractAddresses.push(_contractAddress);
        numberOfDonors++;
    }
    
    function markPatientAsReceiver(address _contractAddress, string memory _timestamp, address _doctorContract, uint _score) public {
        receivers[_contractAddress] = Receiver(_timestamp,_doctorContract,_score);
        receiversContractAddresses.push(_contractAddress);
        numberOfReceivers++;
    }
    
    function addDoctorToDoctorsMap(address _contractAddress, address _accountAddress) public{
        allDoctors[_contractAddress] = _accountAddress;
        doctors.push(_contractAddress);
        numberOfDoctors++;
    }
}