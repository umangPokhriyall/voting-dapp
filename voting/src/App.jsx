import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login'
import Connected from './Components/Connected'
import VotingArtifact from './contracts/Voting.json'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'


function App() {
  const [web3Api, setWeb3Api] = useState({
    provider : null,
    web3 : null,
    contract : null,
  }); 

  const [account, setAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [votingStatus, setVotingStatus] = useState(true)
  const [remainingTime, setRemainingTime] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [number, setNumber] = useState('')
  const [canVote, setCanVote] = useState(true)


  const connectToMetamask = async () => {
    const provider = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);      
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingArtifact.networks[networkId];
        const contract = new web3.eth.Contract(
          VotingArtifact.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3Api({
          web3,
          provider,
          contract,
        });

      const status = await contract.methods.getVotingStatus().call();
      setVotingStatus(status)
      console.log(status)
      const time = await contract.methods.getRemainingTime().call();
      setRemainingTime(parseInt(time,16))
      console.log(parseInt(time,16))
      const candidatesList = await contract.methods.getAllVotesOfCandiates().call();
      const formattedCandidates = candidatesList.map((candidate, index)=>{
        return {
          index: index,
          name: candidate.name,
          voteCount: candidate.voteCount.toString()
        }
      });
      setCandidates(formattedCandidates)
      // console.log(formattedCandidates)
      // console.log(candidatesList)
      
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      provider.on('accountsChanged', (accounts) => setAccount(accounts[0]));
      setIsConnected(true);


      }
      else{
        console.error("Metamask is not detected in browser")
      }
  }

  useEffect(() => {
    const votingStatus = async () => {
      const {contract} = web3Api;
      if (contract && account) {
        try {
      const voteStatus = await contract.methods.voters(account).call();
      setCanVote(!voteStatus);
        }catch (error) {
          console.error('Error fetching vote status:', error);
        }
      }
    };
    votingStatus();
    

  }, [web3Api,account])
  

  const handleNumberChange = async (e) => {
    setNumber(e.target.value);
  }

  const vote  = async () => {
    const {contract} = web3Api;
    await contract.methods.vote(number).send({from:account});
    const voteStatus = await contract.methods.voters(account).call();
    // console.log(voteStatus)
    setCanVote(!voteStatus);
    const candidatesList = await contract.methods.getAllVotesOfCandiates().call();
      const formattedCandidates = candidatesList.map((candidate, index)=>{
        return {
          index: index,
          name: candidate.name,
          voteCount: candidate.voteCount.toString()
        }
      });
      setCandidates(formattedCandidates)

    
  }
  
  
  
  return (
    <>
      <div className="App">
        {isConnected ? <Connected 
                        account = {account}
                        candidates = {candidates}
                        remainingTime = {remainingTime}
                        number = {number}
                        handleNumberChange={handleNumberChange}
                        voteFunction = {vote}
                        canVote = {canVote}
                        /> : <Login connectWallet = {connectToMetamask}/>}
    
      </div>
    </>
  )
}

export default App
