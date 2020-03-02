pragma solidity ^0.5.1;
import "D:/LICENTA/code/blockchain/contracts/Organ.sol";
import "D:/LICENTA/code/blockchain/contracts/ABDKMath64x64.sol";

contract Liver is Organ{
    
    int public receiveScore; //meld score
    int public v1;
    int public v2;
    int public v3;
    int public v4;



    // uint256 donateScore;
    
    event computeScore(int receiveScore);
    
    function computeMELD(int256 bilirubin, int256 inr, int256 creatinine, bool hemodialysis) public returns(int){
        if(bilirubin < 0 ) bilirubin = 1;
        if(inr < 0) inr = 1;
        if(creatinine < 0) creatinine = 1;
        
        if(hemodialysis == true) creatinine = 4;
        
        v1 = ABDKMath64x64.toInt(ABDKMath64x64.mul(ABDKMath64x64.divi(189,50), ABDKMath64x64.ln(ABDKMath64x64.fromInt(bilirubin))));
        v2 = ABDKMath64x64.toInt(ABDKMath64x64.mul(ABDKMath64x64.divi(56,5), ABDKMath64x64.ln(ABDKMath64x64.fromInt(inr))));
        v3 = ABDKMath64x64.toInt(ABDKMath64x64.mul(ABDKMath64x64.divi(957,100), ABDKMath64x64.ln(ABDKMath64x64.fromInt(creatinine)))); 
        v4 = ABDKMath64x64.toInt(ABDKMath64x64.divi(643,100)); 
        
        receiveScore = v1 + v2 + v3 + v4;
        emit computeScore(receiveScore);
        return receiveScore;
    }
    
    
    function getScoreForReceiveOrgan() view external returns (int score) {
        return receiveScore;
    }

}