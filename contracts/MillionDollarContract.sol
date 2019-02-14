pragma solidity ^0.5.1;

contract OneMillionDollarContract {

    struct Pixel {
      uint24 color;
      bool isValue;
      string hoverText;
    }

    mapping(uint24 => Pixel) public pixels;
    address payable public oneMillionDollarAccount;

    modifier costs(uint price){
        if (msg.value >= price) {
            _;
        }
        else{
            revert();
        }
    }

    constructor() public payable {
      oneMillionDollarAccount = msg.sender;
    }

    function setPixel(uint24 coord, uint24 color, string memory hoverText) public payable costs(0.1 ether) {
        if(coord>999999 || pixels[coord].isValue){
          revert();
        }
        oneMillionDollarAccount.transfer(address(this).balance);
        pixels[coord] = Pixel({color:color,isValue:true,hoverText:hoverText});
    }

}
