const { ethers } = require("hardhat");
const { METADATA_URL,PREVIEW_URL } = require("../constants");

async function main() {

  console.log('Deploying contract...');

   const metadataURL = METADATA_URL;
   const previewURL = PREVIEW_URL;

   const Contract = await ethers.getContractFactory("DeadandBeyondAI");

   const contract = await Contract.deploy(
     metadataURL, previewURL, 
     {gasPrice: ethers.utils.parseUnits('45', 'gwei'), 
     gasLimit: 4000000,
     nonce:0}
   );

   await contract.deployed();
   
   console.log('Contract deployed to:', contract.address);
 }



main()
.then(()=>process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode(1);
});
