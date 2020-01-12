pragma solidity ^0.5.1;

contract PatientContract{
    
    string public identifier;
    address public owner;
    
     //map with doctors
    mapping(address => bool) public doctors;
    
    function register(string memory _identifier) public {
        owner = msg.sender;
        identifier = _identifier;
    }
}