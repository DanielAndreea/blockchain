pragma solidity ^0.5.1;
import "D:/LICENTA/code/blockchain/contracts/Organ.sol";
import "D:/LICENTA/code/blockchain/contracts/Liver.sol";

contract PatientContract{
    
    enum OrganType {Liver, Heart}
    OrganType public organType;
    
    string public identifier;
    address public owner;
    
     //map with doctors
    mapping(address => bool) public doctors;
    mapping(string => Organ) public organs;
    
    //constants
    string liver = "LIVER";
    string heart = "HEART";
    
    function register(string memory _identifier) public {
        owner = msg.sender;
        identifier = _identifier;
    }
    
    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
       
	function addDoctorToPatientMap(address _doctorContractAddress, bool value) public {
        doctors[_doctorContractAddress] = value;    
    }
    function addOrganToMap(string memory _organ) public returns(bool){
        bool liverResult = compareStrings(_organ, liver);
        if(liverResult == true) {
            Liver l = new Liver();
            organs[_organ] = l; 
            return true;
        }else{
            bool heartResult = compareStrings(_organ, heart);
            if(heartResult == true){
                return false;
            }else return false;
        }
    }
    
}