import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

export default function Home() {

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [partyTime, setPartyTime] = useState(false);

  useEffect(() =>{
    const target = new Date("11/1/2022 23:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      console.log("now",now);
      const difference = target.getTime() - now.getTime();
      console.log("difference",difference);
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(d);

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setHours(h);

      if (d <= 0 && h <= 0) {
        setPartyTime(true);
      }

    }, 1000)

    return () => clearInterval(interval)
  },[])

  const renderCountdown = () =>{
    if(!setPartyTime) {
        console.log("Celebration Begins");
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
      )
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Dead and Beyond AI</title>
        <meta name="An AI generated NFT collection to be launched on the Day of the Dead 2022 for lost pets" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
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
                  <a href="https://opensea.io/collection/deadandbeyondai/" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/Discord.png"  alt="discord-logo" />
                      <img className = {styles.socialmediaBottom}  src="./ele/Discord_litup.png"  alt="discord-logo" />
                  </a>  
              </button>
              <button className ={styles.socialmediaBtn} type="button"> 
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
              </button>
            </div>
            <div className={styles.countdown}>
                <h2>Release Countdown</h2>
                {renderCountdown()}
            </div>
            <div className ={styles.navRight}>
              <button className ={styles.socialmediaBtn} type="button"> 
                  <a href="https://opensea.io/collection/deadandbeyondai/" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/question.png"  alt="question-logo" />
                      <img className = {styles.socialmediaBottom}  src="./ele/question_litup.png"  alt="question-logo" />
                  </a>  
              </button>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <main className={styles.main}>     
          <h1 className={styles.title}>
          Dead and Beyond AI
          </h1>

          <div className={styles.intro}>
            <div className={styles.english}>
              <p>
              Launching on the Day of the Dead, the Dead and Beyond AI collection is a way to honor lost pets who have left us over the years. <br></br><br></br>
              The art is AI generated, but we humans are the ones who have taken control over the AI system to find our pets! 
              We want to get the images back from the dead.
              </p>
            </div>

            <div className={styles.spanish}>
              <p>
              El lanzamiento del Día de los Muertos, con la colección de Dead and Beyond IA honoramos a las mascotas perdidas que nos han dejado a lo largo de los años. <br></br><br></br>
              El arte se genero con IA y nosotros los vivos tomamos el control del sistema para reencontrarnos con nuestras mascotas.
              </p>
            </div>

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
          <div className={styles.mintBtn}>
            <button className ={styles.socialmediaBtn} type="button"> 
                  <a href="https://opensea.io/collection/deadandbeyondai/" target="_blank" rel="noreferrer">
                      <img className = {styles.socialmediaTop}  src="./ele/Mint.png"  alt="mint-button" />
                      <img className = {styles.socialmediaBottom}  src="./ele/Mint_litup.png"  alt="mint-button" />
                  </a>  
              </button>
          </div>
      </main>

      {/* FOOTER */}
        <div className={styles.footer}>
          <img className = {styles.footerImgLeft}  src="./ele/Candle_1.png"  alt="img" />
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by The Dead AI
          </a>
          <img className = {styles.footerImgRight}  src="./ele/Candle_2.png"  alt="img" />

        </div>
   
    </div>
 </div>
  )
}
