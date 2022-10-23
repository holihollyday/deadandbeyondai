const { ethers } = require("hardhat");
const { METADATA_URL,PREVIEW_URL } = require("../constants");

async function main() {
   const metadataURL = METADATA_URL;
   const previewURL = PREVIEW_URL;


   //first contract
   const NFTcontract = await ethers.getContractFactory("DeadandBeyondAI");

   const gasPrice = await NFTcontract.signer.getGasPrice();
   console.log(`Current gas price: ${gasPrice}`);

   const estimatedGas = await NFTcontract.signer.estimateGas(
    // NFTcontract.getDeployTransaction()
   );
   console.log(`Estimated gas: ${estimatedGas}`);
   const deploymentPrice = gasPrice.mul(estimatedGas);
   const deployerBalance = await NFTcontract.signer.getBalance();
   console.log(`deployerBalance: ${deployerBalance}`);

   if (Number(deployerBalance) < Number(deploymentPrice)) {   
    throw new Error("You dont have enough balance to deploy.");
  }

   console.log('Deploying contract...');

   const contract_NFT = await NFTcontract.deploy(
     metadataURL, previewURL, 
    //  {gasPrice: ethers.utils.parseUnits('20', 'gwei'), 
    //  gasLimit: 65000,
    //  nonce:46}
   );

   await contract_NFT.deployed();
   console.log('Contract_NFT deployed to:', contract_NFT.address);
 }



main()
.then(()=>process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode(1);
});
