// Nebula Bridge - Connection Logic
const contractAddress = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
const abi = [
    "function claim() external",
    "function schedules(address) view returns (uint256, uint256, uint256, uint256)"
];

let provider, signer, contract;

async function init() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const btn = document.getElementById('connect-btn');

        btn.onclick = async () => {
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            
            btn.innerText = `LINKED_${address.slice(0,6)}...`;
            btn.classList.add('bg-green-500', 'text-black');
            
            loadVestingData(address);
        };
    }
}

async function loadVestingData(userAddress) {
    contract = new ethers.Contract(contractAddress, abi, provider);
    const schedule = await contract.schedules(userAddress);
    // Logic to update the UI with real blockchain data
    console.log("Vesting Schedule:", schedule);
}

document.getElementById('claim-btn').onclick = async () => {
    try {
        const tx = await contract.connect(signer).claim();
        alert("Claim Transaction Sent: " + tx.hash);
    } catch (err) {
        alert("Execution Error: Check console.");
    }
};

init();
