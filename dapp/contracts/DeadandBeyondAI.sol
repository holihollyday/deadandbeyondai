// SPDX-License-Identifier: MIT
                                                                                   

pragma solidity ^0.8.17;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract DeadandBeyondAI is ERC721A, Ownable, ReentrancyGuard{
    
    using Strings for uint256;
    
    bytes32 public merkleRoot;
    mapping(address => bool) public allowlistClaimed;

    string cover;
    string public hiddenDead;

    bool public _paused = false;
    bool public isValid = false;
    bool public earlyOfferStarted = false;
    bool public earlyOfferEnded = false;
    bool public revealed = false;
    bool public prayforAllSoulsFinished = false;

    uint256 public immutable maxAmount = 1101; 
    uint256 public maxDeadAIPerTx = 1;
    uint256 public _allowlistPrice = 0.01 ether;
    uint256 public _publicPrice = 0.02 ether;
 
  
    constructor(
    string memory coverURI,
    string memory hiddenDeadURL
      ) ERC721A("DeadandBeyondAI", "DNB_AI") {
    cover = coverURI;
    hiddenDead = hiddenDeadURL;
  }

    modifier onlyWhenNotPaused {
            require(!_paused, "CONTRACT PAUSED");
            _;
        }

    modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 merkleRoot){
      require(
        MerkleProof.verify(
          merkleProof,
          merkleRoot,
          keccak256(abi.encodePacked(msg.sender))
        ),
        "NOT ON ALLOWLIST LIST"
      );
      _;
    }
    modifier passDeathCheck {
    // modifier passBeautyCheck {
      require(balanceOf(msg.sender) == 0, "ONE DEAD PER WALLET");
      require(totalSupply() + maxDeadAIPerTx <= maxAmount, "EXCEED MAX AMOUNT");
      _;
    }

//  function fashionlistMint(bytes32[] calldata merkleProof)
    function allowlistMint(bytes32[] calldata merkleProof)
        external
        payable
        onlyWhenNotPaused
        nonReentrant
        passDeathCheck
        isValidMerkleProof(merkleProof, merkleRoot){

        require(earlyOfferStarted&&!earlyOfferEnded, "NOT RIGHT TIME");
        require(totalSupply() + maxDeadAIPerTx <= maxAmount, "EXCEED MAX AMOUNT");
        require(msg.value >= _allowlistPrice, "Ether sent is not correct");
        allowlistClaimed[msg.sender] = true;
        _safeMint(msg.sender, 1);
  }

    function wakeDead() external payable onlyWhenNotPaused nonReentrant passDeathCheck{
//   function beTooCool() external onlyWhenNotPaused nonReentrant passBeautyCheck{
        require(earlyOfferEnded, "NOT RIGHT TIME");
        require(balanceOf(msg.sender) == 0, "ONE DEAD PER WALLET");
        require(totalSupply() + maxDeadAIPerTx <= maxAmount, "EXCEED MAX AMOUNT");
        require(msg.value >= _publicPrice, "Ether sent is not correct");
        _safeMint(msg.sender, 1);
  }
  
  function _baseURI() internal view virtual override returns (string memory) {
     return cover;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "NONEXISTENT DEAD");
    if(revealed == false){
      return hiddenDead;
    }
    else{
    string memory coverURI = _baseURI();

    return bytes(coverURI).length > 0 ? string(abi.encodePacked(coverURI, tokenId.toString(), ".json")) : "";
    }
  }

  function _startTokenId() internal view virtual override returns (uint256) {
    return 1;
  }

//    ___       __             __          ____       __    
//   / _ \___  / /__ ____  ___/ /__ ____  / __ \___  / /_ __
//  / // / _ \/ / _ `/ _ \/ _  / -_) __/ / /_/ / _ \/ / // /
// /____/\___/_/\_,_/_//_/\_,_/\__/_/    \____/_//_/_/\_, / 
//                                                   /___/  

    function setPaused(bool _state) external onlyOwner {
    _paused = _state;
  }
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
    merkleRoot = _merkleRoot;
  }
    function setearlyOfferStarted(bool _state) external onlyOwner {
    earlyOfferStarted = _state;
  }
    function setearlyOfferEnded(bool _state) external onlyOwner {
    earlyOfferEnded = _state;
  }
    function reveal () external onlyOwner(){
    revealed = true;
  }

    function prayforAllSouls(address DeadPrayer, uint256 reserveDead) external onlyOwner {
//    function champagneBeforeParty(address Dolander, uint256 reserveBeauty) external onlyOwner {
        require(!prayforAllSoulsFinished, "RESERVE MINT COMPLETED");

        uint256 totalToocool = totalSupply();
	      require(totalToocool + reserveDead <= maxAmount,"EXCEED MAX AMOUNT");
        _safeMint(DeadPrayer, reserveDead);

        prayforAllSoulsFinished = true;
    }

    function celebrateLife(address _life, uint256 _soul) external onlyOwner {
//   function toocoolTreats(address _lover, uint256 _kiss) external onlyOwner {
    require(totalSupply() + _soul <= maxAmount, "EXCEED MAX AMOUNT");
    _safeMint(_life, _soul);
  }

  function withdraw() external payable onlyOwner {
    (bool success, ) = payable(owner()).call{value: address(this).balance}('');
    require(success, "SEND ETHER FAILED");
  }

}

//"https://ipfs.io/ipfs/QmbonaVJTbGgKpkxc7St9xrptTiTJvVGdqRpDivuzsr7eJ/" "https://ipfs.io/ipfs/Qmds6AjhexhWFKcVqnEqr5b2fG3ybqEfkwZuEYWQ79HXRL?filename=hidden_metadata.json"
// "https://ipfs.io/ipfs/QmbonaVJTbGgKpkxc7St9xrptTiTJvVGdqRpDivuzsr7eJ/" "https://ipfs.io/ipfs/Qmds6AjhexhWFKcVqnEqr5b2fG3ybqEfkwZuEYWQ79HXRL?filename=hidden_metadata.json"