pragma solidity ^0.5.1;

interface Organ {
    function getScoreForReceiveOrgan() view external returns (int score);
}