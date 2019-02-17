pragma solidity ^0.5.1;

contract OneMillionDollarContract {

    struct Pixel {
      uint24 color;
      bool isValue;
      string hoverText;
    }

    uint24[] public pixelList;
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

    function setPixel(uint24 coord, uint24 color, string memory hoverText) public payable costs(0.01 ether) {
        if(coord>999999 || pixels[coord].isValue){
          revert();
        }
        oneMillionDollarAccount.transfer(address(this).balance);
        pixels[coord] = Pixel({color:color,isValue:true,hoverText:hoverText});
        pixelList.push(coord);
    }

    function getPixelList() public view returns(uint24[] memory){
        return pixelList;
    }

    function getColorsFromList(uint24[] memory pList) public view returns(uint24[] memory){
        uint24[] memory colors = new uint24[](pList.length);
        for(uint i = 0; i < pList.length; i++){
            colors[i] = pixels[pList[i]].color;
        }
        return colors;
    }
}
