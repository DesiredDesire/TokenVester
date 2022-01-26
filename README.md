# TokenVester <br />
In hardhat folder one finds smart contracts and automated tests. <br />
Please enter folder and use hardhat envoirement to: <br />
compile   $ npx hardhat compile <br />
test      $ npx hardhat test <br />
deploy    $ npx hardhat --network YOUR_NETWOEK run ./script/deploy.js. <br />
<br />
In app folder one finds very simple html app to interact with TokenVester smartcontract. <br />
To test the app please first prepare a hardhat local node with deployed smart contracts. <br />
Enter the hardhat folder and start local node: <br />
          $ npx hardhat node <br />
deploy smart contracts on local node: <br />
          $ npx hardhat --network localhost ./scripts <br />
the deploy script logs the erc20Mintable address, TokenVester address, owner address. <br />
Next copy the TokenVester address and paste it in app/index.html to const variable vesterAddress. <br />
Start local server from app folder <br />
          $ python3 -m http.server <br />
Open web browser with installed Metamask extension. <br />
Import owner private key. It was logged after starting the hardhat localnode. <br />
<br />
In browser go to : http://localhost:8000/ <br />
<br />
With connect button the app connects to the MetaMask extension.<br />
After connecting to Metamask one can call vest and claim functions.<br />
