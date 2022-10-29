import Head from 'next/head'
import {use, useEffect, useState} from 'react';
import Popup from 'reactjs-popup';
import styles from '../styles/Home.module.css'

import { ConnectButton, useAccount } from "@web3modal/react";
import { Contract, ethers, providers, utils} from "ethers";

import { abi, NFT_CONTRACT_ADDRESS, poem_abi, POEM_CONTRACT_ADDRESS} from "../constants";
import { addressList } from "../address";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";


export default function Home() {

  //COUNTDOWN 
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [partyTime, setPartyTime] = useState(false);
  //CHECK WALLET
  const { address, isConnected } = useAccount();
  const [web3Modal, setWeb3Modal] = useState(null)
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0"); 
  //CHECK STATE
  const [loading, setLoading] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  //CHECK ALLOWLIST
  const [merkleTree, setMerkleTree] = useState(null);
  const [rootHash, setrootHash] = useState(null);
  const [merkleProof, setmerkleProof] = useState("");
  const [messageHash, setHash] = useState(null); 
  const [signature, setSignature] = useState(null); 
  //CHECK IF VALID/CLAIMED
  const [isValid, setisValid] = useState(false);
  const [isClaimed, setisClaimed] = useState(false);

  const api ="https://launchpad.heymint.xyz/api/embed?projectId=53&chain=ETH_GOERLI&address=0xF546F5aE11913d66A0669aAA7C237AC9ADA76e0C";
   /**
   * checkifValid: Check if presale has started
   */
  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const presaleStarted = await nftContract.isPresaleActive();
      console.log("Has Presale started? --", presaleStarted);
      //preslaeMintedStarted = false then do the following
      if (!presaleStarted){
        console.log("...", presaleStarted);
      }   
      setPresaleStarted(presaleStarted);
      return presaleStarted;   

    } catch (err) {
      console.error(err);
    }
  };

   /**
   * checkifPresaleEnded: Check if presale has ended
   */
  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const presaleEnded = await nftContract.isPublicSaleActive();
      console.log("Has Public sale started? --", presaleEnded);
      //presaleEnded = true then do the following
      if (presaleEnded){
        console.log("Public Sale Started");
      }
      setPresaleEnded(presaleEnded);
      return presaleEnded; 

    } catch (err) {
      console.error(err);
    }
  };


  const getData = async () => {
    try {
      console.log("Checking... Who is this human?")

      const signer = await getProviderOrSigner(true);
      //get address
      const signerAddress = await signer.getAddress();
    
        fetch("https://launchpad.heymint.xyz/api/embed?projectId=53&chain=ETH_GOERLI&address="+signerAddress)
        .then((response) => response.json())
        .then(data => {
          const messageHash = data.allowlist.messageHash;
          const signature = data.allowlist.signature;
          setHash(messageHash);
          setSignature(signature);
          console.log(messageHash, signature);
        }
      )
        .catch(error => console.log('ERROR'));
        // .then((response) => response.json())
        // .then((data) => data.allowlist.messageHash, data.allowlist.signature);

        // const res = await fetch("https://launchpad.heymint.xyz/api/embed?projectId=53&chain=ETH_GOERLI&address="+signerAddress);
        // console.log(res.json().allowlist.messageHash);
        // const messageHash = res.json().allowlist.messageHash;
        // const signature = res.allowlist.signature;


        
        return messageHash, signature;
        

    }
    catch (err) {
      console.error(err);
    }
  };

  /**
   * checkifValid: Check if the address is valid for presale
   */
   const checkifValid = async () => {
    try {

      console.log("Checking... Who is this human?")

      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
   
        //get address
        const signerAddress = await signer.getAddress();
        //console.log("providerAddress:", signerAddress, typeof signerAddress);

        // //build a tree
        // const leafNodes = addressList.map(addr => keccak256(addr))
        // const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
        // setMerkleTree(merkleTree);

        // //get the tree root
        // const rootHash = '0x' + merkleTree.getRoot().toString('hex');
        // setrootHash(rootHash);

        // //get claimingAddress object
        // const claimingAddress= keccak256(signerAddress);
        // //console.log("claimingAddress", claimingAddress, typeof claimingAddress);
        
        // //get merkle proof for the claiming address
        // const merkleProof =  merkleTree.getHexProof(claimingAddress);
        // setmerkleProof(merkleProof);


        const isValid = await nftContract.verifySignerAddress(messageHash,signature);

        // const isValid = merkleTree.verify(data.allowlist.messageHash, data.allowlist.signature);
        setisValid(isValid);

      console.log("Is this human on the allowlist? --", isValid);
      return isValid;

    }
    catch (err) {
      console.error(err);
    }
  };

   /**
   * checkifClaimed: Check if the address has claimed an NFT 
   */
    const checkifClaimed = async () => {
      try {
       const signer = await getProviderOrSigner(true);
       const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
       const signerAddress = await signer.getAddress();
      // call the balance of the address
      const balance = await nftContract.balanceOf(signerAddress);
      // console.log("balance --", balance.toNumber());
      if(balance > 0){
        isClaimed = true;
      }
  
      setisClaimed(isClaimed);
      console.log("Has the HUMAN claimed a DNB? --", isClaimed);
      return isClaimed; 
  
      } catch (err) {
        console.error(err);
      }
  };

  /**
   * checkifSoldOut: Check if Soldout
   */
  const checkifSoldOut = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _tokenIds = await nftContract.totalSupply();

      if(_tokenIds.toString() == '1101'){
        soldOut = true;
      }
      setSoldOut(soldOut);
      return soldOut;

    } catch (err) {
      console.error(err);
    }
  };

/**
   * presaleMint: Allowlist mint an NFT
   */
const presaleMint = async () => {
  try { 
    console.log("Presale mint");

    const signer = await getProviderOrSigner(true);
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
 
    // call the presale from the contract and pass true to it
    const tx = await nftContract.presaleMint(messageHash, signature, 1,1, {
      value: utils.parseEther("0.01"),
    });
    _safeMint(msg.sender, tokenIds);

    setLoading(true);
    await tx.wait();
    setLoading(false);

  } catch (err) {
    console.error(err);
  }
};

/**
 * publicMint: Mint an NFT
 */
const publicMint = async () => {
  try {
    console.log("Public mint");
    const signer = await getProviderOrSigner(true);
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
    const tx = await nftContract.mint(1,{
      value: utils.parseEther("0.02"),
    });

    // console.table(tx);
    setLoading(true);
    await tx.wait();
    setLoading(false);

  } catch (err) {
    console.error(err);
  }
};


/**
 * poemMint: Mint an NFT poem
 */
 const poemMint = async () => {
  try {
    console.log("Poem mint");
    const signer = await getProviderOrSigner(true);
    const poemContract = new Contract(POEM_CONTRACT_ADDRESS, poem_abi, signer);
    const tx = await poemContract.mint({
      value: utils.parseEther("0.0"),
    });

    // console.table(tx);
    setLoading(true);
    await tx.wait();
    setLoading(false);

  } catch (err) {
    console.error(err);
  }
};

  /*
  * Web3Modal: CONNECT TO THE NETWORK
  */
  const getProviderOrSigner = async (needSigner = false) => {
    // const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    // const web3Provider = new ethers.providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      // window.alert("Change the network to Mainnet");
      throw new Error("Change network to Mainnet");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };


/**
   * getTokenIdsMinted: gets the number of tokenIds that have been minted
   */
 const getTokenIdsMinted = async () => {
  try {
    const provider = await getProviderOrSigner();
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
    const _tokenIds = await nftContract.totalSupply();
    //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
    setTokenIdsMinted(_tokenIds.toString());
    // console.log(_tokenIds);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() =>{
    const target = new Date("11/1/2022 23:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(d);

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setHours(h);

      if (d <= 0 && h <= 0) {
        d=0;
        h=0;
        setDays(d);
        setHours(h);
        setPartyTime(partyTime);
        return partyTime;   
      }

    }, 1000)
    return () => clearInterval(interval)

  },[]);

  useEffect(() =>{
    //Check if the user has connect the wallet
        if(isConnected){
      const presaleStarted = checkIfPresaleStarted();
      if (presaleStarted) {
        checkIfPresaleEnded();
      }
      getTokenIdsMinted();
      checkifSoldOut();
      getData();

   
        checkifClaimed();
        // checkifValid();   

      // set an interval to get the number of token Ids minted every 3 seconds
        setInterval(async function () {
          await checkIfPresaleStarted();
          await getTokenIdsMinted();
          await checkifClaimed();
          await checkifSoldOut();
        }, 3 * 1000);
      }else{
        getTokenIdsMinted();
      }
  }, [isConnected]);

  /*
  * RENDER ELEMENTS
  */
  const renderScreen = () =>{
    if(!isConnected){
      return (
      <div className={styles.intro}>
          <div className={styles.english}>
            <p>
            Launching on the Day of the Dead, the Dead and Beyond AI collection is a way to honor lost pets who have left us over the years. <br></br><br></br>
            The art is AI generated, but we humans are the ones who have taken control over the AI system to find our pets! 
            We want to get the images back from the dead.
            </p>
          </div>
{/* 
          <div className={styles.spanish}>
            <p>
            El lanzamiento del Día de los Muertos, con la colección de Dead and Beyond IA honoramos a las mascotas perdidas que nos han dejado a lo largo de los años. <br></br><br></br>
            El arte se genero con IA y nosotros los vivos tomamos el control del sistema para reencontrarnos con nuestras mascotas.
            </p>
          </div> */}

          <div className={styles.intro_mobile}>
            <p>
            1101 NFTs <br></br><br></br>
            Pre Mint <br></br>
            November 1 <br></br>

            Public Mint <br></br>
            November 2 <br></br>
            </p>
            <p>
            Pre Mint <br></br>
            1 de noviembre <br></br>

            Mint Público<br></br>
            2 de noviembre <br></br>
            </p>
          </div>
      </div>
      );
    }
    if(soldOut){
      return (
        <div className={styles.intro_short}>
              <div className={styles.walletInfo}>
              <h2>1101 SOLD OUT</h2>
              <p>Connected Address:</p><p> {address}</p>
              </div>
  
        </div>
      );
    }
    return (
      <div>
          <div className={styles.intro_short}>
                <div className={styles.walletInfo}>
                <h2>{tokenIdsMinted}/1101 minted</h2>
                  <p>Connected Address:</p><p> {address}</p>
                  <p>Wake up a dead pet: 0.01 ETH</p>
                </div>
          </div>

      </div>
    );
  };
    
    const renderButton = () => {
      //  if(!isConnected ){
      //   return (
      //     <div>
      //          <div className={styles.walletInfo}>
      //             <h2>{tokenIdsMinted}/1101 minted</h2>
      //               <p>Honor lost pets: 0.01 ETH/wallet</p>
      //               <button className ={styles.socialmediaBtn} type="button"> 
      //                 <img className = {styles.socialmediaTop}  src="./ele/join.png"  alt="button" />;
      //                 <img className = {styles.socialmediaBottom}  src="./ele/join.png"  alt="button" />;
      //               </button>
      //           </div>
  
      //     </div>
      //     );
      //  }
       if(!isConnected && !soldOut){
        return (
          <div>
               <div className={styles.walletInfo}>
                  <h2>{tokenIdsMinted}/1101 minted</h2>
                    <p>Honor lost pets: 0.01 ETH/wallet</p>
                     <ConnectButton />
                </div>
          </div>
          );
       }
       
       if(soldOut){
        return (
          <div> 
              <button className ={styles.socialmediaBtn}   type="button"> 
                <a href="https://opensea.io/deadandbeyondai" target="_blank" rel="noreferrer">
                <img className = {styles.socialmediaTop}  src="./ele/market.png"  alt="mint-button" />
                <img className = {styles.socialmediaBottom}  src="./ele/market_litup.png"  alt="mint-button" />
                </a>
            </button>
          </div>
        )
       }

        if (loading) {
          return (
          <div>
             <img className = {styles.socialmediaTop}  src="./ele/Loading.png"  alt="button" />
          </div>
           );
        }
    
        //PRESALE START
        //If presale hasn't started yet 
        if (!presaleStarted && !presaleEnded) {
          return <img className = {styles.socialmediaTop}  src="./ele/NotYet.png"  alt="button" />;
        } 
  
        //If presale started, hasn't ended yet
        if (presaleStarted && !presaleEnded && !isClaimed) {
          return (
          <div>
            <button className ={styles.socialmediaBtn} type="button"> 
              <img className = {styles.socialmediaTop}  onClick={presaleMint} src="./ele/AllowlistMint.png"  alt="mint-button" />
              <img className = {styles.socialmediaBottom}  onClick={presaleMint} src="./ele/AllowlistMint_litup.png"  alt="mint-button" />
            </button>
         </div>
          );
        }
        if (presaleStarted && !presaleEnded && !isClaimed && !isValid) {
          return <img className = {styles.socialmediaTop}  src="./ele/NotYet.png"  alt="button" />;
        }

        //PUBLIC SALE
        //not claimed
        if (presaleStarted && presaleEnded && !isClaimed) {
          return (
         <div>
            <button className ={styles.socialmediaBtn} type="button"> 
              <img className = {styles.socialmediaTop}  onClick={publicMint} src="./ele/Mint.png"  alt="mint-button" />
              <img className = {styles.socialmediaBottom}  onClick={publicMint} src="./ele/Mint_litup.png"  alt="mint-button" />
            </button>
         </div>
          );
        }  
        //on allowlist, not claimed
        // if (presaleStarted && !presaleEnded && isValid && !isClaimed) {
        //   return (
        // <div>
        //     <img className = {styles.socialmediaTop}  onClick={presaleMint} src="./ele/AllowlistMint.png"  alt="mint-button" />
        //     <img className = {styles.socialmediaBottom}  onClick={presaleMint} src="./ele/AllowlistMint_litup.png"  alt="mint-button" />
        //  </div>
        //   );
        // }
         //not on allowlist
        // if (presaleStarted && !presaleEnded && !isValid) {
        //   return (
        //  <div>
        //     <img className = {styles.socialmediaTop} src="./ele/NotYet.png"  alt="button" />
        //  </div>
        //   );
        // }
    
         //If token has already be minted
         if (isClaimed) {
          return (
            <div>  
              <div>A DEAD PET IS WAKEN <br></br> 
              you are granted to <br></br> 
              mint an ON-CHAIN poem</div>  
      
                <button className ={styles.socialmediaBtn} type="button">       
                  {/* <a href="https://opensea.io/account" target="_blank" rel="noreferrer"> */}
                    <img className = {styles.socialmediaTop} onClick={poemMint} src="./ele/Mint.png"  alt=" Button" />    
                    <img className = {styles.socialmediaBottom} onClick={poemMint} src="./ele/Mint_litup.png"  alt=" Button" />   
                    {/* </a> */}
                </button>
            </div>
          );
       }   
      }

  const renderCountdown = () =>{
    if(!setPartyTime) {
        console.log("Celebration Begins");
        return(<div></div>);
    }
    else{
        return(
        <div>
           <div className={styles.countdownContainer}>
     
              <div className={styles.countdownTime}>
                    <span className={styles.time}>{days}</span><br></br>
                    <span className={styles.label}>DAYS</span>
              </div>
              <div className={styles.countdownTime}>
                    <span className={styles.time}>{hours}</span><br></br>
                    <span className={styles.label}>HOURS</span>
              </div>
         </div>
        </div>
      );
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <meta charSet="UTF-8"></meta>
        <title>Dead and Beyond AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
       {/* FAVICONS */}
        <link rel="apple-touch-icon" size="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" size="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" size="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="shortuct icon" href="/favicons/favicon.ico" />
        {/* META TAGS */}
        <meta content="An AI generated NFT collection to be launched on the Day of the Dead 2022 for lost pets." name="description"></meta>
        <meta property="og:url" content="https://deadandbeyondai.com"></meta>
        <script
              defer
              src="https://launchpad.heymint.xyz/api/embed.js"
              data-project-id="53"
              data-chain="ETH_GOERLI"
              ></script>
          
      </Head>

      <div className={styles.content}>
        {/* NAVIGATION */}
        <div className = {styles.nav}>
          <div  className = {styles.navLeft}> 

              <button className ={styles.socialmediaBtn} type="button"> 
                  <a href="https://twitter.com/deadandbeyond/" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/twitter.png"  alt="twitter-logo" />
                      <img className = {styles.socialmediaBottom}  src="./ele/twitter_litup.png"  alt="twitter-logo" />
                  </a>  
              </button>
              <button className ={styles.socialmediaBtn} type="button"> 
                  <a href="https://discord.gg/6FfsrFEJW9" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/Discord.png"  alt="discord-logo" />
                      <img className = {styles.socialmediaBottom}  src="./ele/Discord_litup.png"  alt="discord-logo" />
                  </a>  
              </button>
              {/* <button className ={styles.socialmediaBtn} type="button"> 
                  <a href="https://opensea.io/collection/deadandbeyondai/" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/etherscan.png"  alt="etherscan-logo" />
                      <img className = {styles.socialmediaBottom}  src="./ele/etherscan_litup.png"  alt="etherscan-logo" />
                  </a>  
              </button>
              <button className ={styles.socialmediaBtn} type="button"> 
                  <a href="https://opensea.io/collection/deadandbeyondai/" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/opensea.png"  alt="opensesa-logo" />
                      <img className = {styles.socialmediaBottom}  src="./ele/opensea_litup.png"  alt="opensesa-logo" />
                  </a>  
              </button> */}
            </div>
            <div className={styles.countdown}>
                <h2>Release Countdown</h2>
                {renderCountdown()}
            </div>
            <div className ={styles.navRight}>
             <Popup trigger={  <button className ={styles.socialmediaBtn} type="button"> 
                    {/* <a href="https://opensea.io/collection/deadandbeyondai/" target="_blank" rel="noreferrer"> */}
                    <a>
                        <img className = {styles.socialmediaTop}  src="./ele/question.png"  alt="question-logo" />
                        <img className = {styles.socialmediaBottom}  src="./ele/question_litup.png"  alt="question-logo" />
                    </a>  
                </button> } >
                <div  className ={styles.instruction}>
                  <h2>How to Mint?</h2>
                  <span>Step 1. Download a <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">Metamask wallet</a></span><br></br>
                  <span>Step 2. Deposit ETH - <a href="https://metamask.zendesk.com/hc/en-us/articles/360028141672" target="_blank" rel="noreferrer">instruction</a></span><br></br>
                  <span>Step 3. Connect wallet below & mint</span><br></br><br></br>
                  <span>Contact us on Twitter<a href="https://twitter.com/deadandbeyond/" target="_blank" rel="noreferrer"> @deadandbeyond</a> if you meet any issues.</span>
                </div>
              </Popup>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <main className={styles.main}>     
          <h1 className={styles.title}> Dead and Beyond AI </h1>
          {renderScreen()}

          <div className={styles.mintBtn}>
             {/* {renderButton()} */}
             <button className ={styles.socialmediaBtn} type="button"> 
                  <a href="https://heymint.xyz/dead-and-beyond-ai" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/Join.png"  alt="logo" />
                      <img className = {styles.socialmediaBottom}  src="./ele/Join_litup.png"  alt="logo" />
                  </a>  
              </button>
          </div>

      </main>

      {/* FOOTER */}
        <div className={styles.footer}>
          <img className = {styles.footerImgLeft}  src="./ele/candle_l.gif"  alt="img" />
          <div className={styles.footerText}>
            <a>
              Powered by Dead AI
            </a>
          </div>
          <img className = {styles.footerImgRight}  src="./ele/candle_r.gif"  alt="img" />

        </div>
   
    </div>
 </div>
  );
}

