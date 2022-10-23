const { ethers } = require("hardhat");

async function main() {

  console.log('Deploying contract...');

   //second contract
   const POEMcontract = await ethers.getContractFactory("DeadandBeyondAI_Poem");

   const contract_POEM = await POEMcontract.deploy(
    {gasPrice: ethers.utils.parseUnits('45', 'gwei'), 
    gasLimit: 4000000,
    nonce:0}
  );

  await contract_POEM.deployed();
  console.log('Contract_POEM deployed to:', contract_POEM.address);
 }



main()
.then(()=>process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode(1);
});
