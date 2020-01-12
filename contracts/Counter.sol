pragma solidity ^0.5.1;


contract Counter {
    
    uint count; //state variable 
    //value of this variable will be written to blockchain
    address owner;
    
    //default value => constructor function
    //called when contract is created
    constructor() public{
        count = 0;
        owner = msg.sender;
    }
    
    
    //events
    event Increment(uint value);
    event Decrement(uint value);
    
    /*
    - anyone on the blockchain can subscribe to the declared events
    - can find the history of events on the blockchain
    */
    
    //set value of count
    //increment value
    //need to add visibility to functions => tell where the fct can be called
    //public => can be called outside the contract

    //require adresa care semneaza sa fie "adresa"
    function increment() public{
        count += 1;        
        emit Increment(count); //emit event defined previously
    }

    //decrement value    
    function decrement() public{
        count -=1;
        emit Decrement(count);
    }
    
    function getCount() public view returns (uint) {
        return count;
    }
}