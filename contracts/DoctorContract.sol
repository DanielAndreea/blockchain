pragma solidity 0.5.1;


contract DoctorContract{
    
    enum Specialization {Neurology, Pediatrics, Surgery, Urology}
    Specialization public specialization;
     
    address public owner;
    string public firstName;
    string public lastName;
    uint256 public age;
    
    
    //map with consulted patients
    mapping(address => address) public consultedPatients;
    
    function register(string memory _firstName, string memory _lastName, uint256 _age, uint _specialization) public {
        owner = msg.sender;
        firstName = _firstName;
        lastName = _lastName;
        age = _age;
        specialization = Specialization(_specialization);
    }

    function consultPatient(address  _patientAccountAddress, address  _patientContractAddress) public{
        consultedPatients[_patientAccountAddress] = _patientContractAddress;
    }
    
}