# TokenVester
In hardhat folder one finds smart contracts and automated tests.
Please enter folder and use hardhat envoirement to:
compile   $ npx hardhat compile
test      $ npx hardhat test
deploy    $ npx hardhat --network YOUR_NETWOEK run ./script/deploy.js.

In app folder one finds very simple html app to interact with TokenVester smartcontract.
To test the app please first prepare a hardhat local node with deployed smart contracts.
Enter the hardhat folder and start local node: 
          $ npx hardhat node
deploy smart contracts on local node:
          $ npx hardhat --network localhost ./scripts
the deploy script logs the erc20Mintable address, TokenVester address, owner address.
Next copy the TokenVester address and paste it in app/index.html to const variable vesterAddress.
Start local server from app folder
          $ python3 -m http.server
Open web browser with installed Metamask extension.
Import owner private key. It was logged after starting the hardhat localnode.

In browser go to : http://localhost:8000/

With connect button the app connects to the MetaMask extension.
After connecting to Metamask one can call vest and claim functions.
