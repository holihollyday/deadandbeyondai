import '../styles/globals.css'
import { Web3Modal } from "@web3modal/react";
import { chains, providers } from "@web3modal/ethereum";

const modalConfig = {
  theme: "dark",
  accentColor: "blackWhite",
  ethereum: {
    appName : "Dead and Beyond AI",
    chains: [
      chains.goerli,
      chains.mainnet
    ],
    providers:[
      providers.walletConnectProvider({
        projectId:"33299da0dc78330b4b08c484d1123400",
      }),
    ],

    autoConnect: true,
  },
  projectId:"33299da0dc78330b4b08c484d1123400",
};

function MyApp({ Component, pageProps }) {
  return (
  <>
     <Component {...pageProps} />
     <Web3Modal style={"margin:8px"} config={modalConfig} />
  </>
  );
}

export default MyApp
