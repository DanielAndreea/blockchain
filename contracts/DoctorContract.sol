pragma solidity ^0.5.1;


contract DoctorContract{
    
    enum Specialization {Neurology, Pediatrics, Surgery, Urology}
    Specialization public specialization;
     
    address public owner;
    string public firstName;
    string public lastName;
    uint256 public age;
    
    
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
        //emit consultedPatient(consultedPatients[_patientAccountAddress]);
        return consultedPatients[_patientAccountAddress];
    }

}