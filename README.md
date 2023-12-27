# 🏗 Classy Loogies

🧪 An open-source, up-to-date toolkit for building fully onchain and customizable NFT Collections using Base64 encoding and Standard Vector Graphics.

In it's current state, this project is meant as a learning experience and to provide a proof of concept to create fully onchain and customizables NFTs.

Feel free to fork it and expand upon it or to create your own version of the NFTs!

## Contracts
  `ClassyLoogies.sol` is the main implementation smart contract which inherits from `OnChainNft.sol` (more on that in a bit), alongside inheriting from `ERC721Enumerable.sol` and `Ownable.sol`.
  This smart contract allows you to create a loogy with a wide variety of properties and attributes. More specifically, the NFT collection follows a simplistic RPG style system.
  Where each NFT has a specific class, and based on that class it is given a set of stats and an appropriate weapon. Additionally, it is used assumed that when the NFT is minted,
  the minter (aka user) can only define the NFT's name, class, and color, as those are purely aesthetic properties.

  `OnChainNFT.sol` adds a bit of abstraction to everything. This one handles creating the entire Base64 encoding of the NFT's properties, attributes, and images. Using this,
  you can create virtually any kind of completely onchain NFT in a simplistic and flexible manner. Additionally, it provides functionality to build "Fictional" NFTs, meaning
  that it is possible to generate an NFT's complete Base64 encoded data from a client side without having to mint a new NFT. This provides functionality for client-side
  applications to "Preview" or create any type of NFT before making the commitment onchain. This is done by passing the proper parameters into it's `generateMetadata` view function.
  `ClassyLoogies.sol` inherits `OnChainNFT`. It defines the SVG components, name, description, and attributes then passes it along to the `OnChainNFT.generateMetadata` to build
  its entirely onchain implementation.

  ## Scaffold-Eth-2
  This project uses Scaffold-Eth-2 as the base code. With this, we have a complete foundry project which hooks into a frontend allowing for quick development and iteration on smart contract 
  and frontend code. Additionally, it allows for easy deployment processes to a variety of chains and the frontend to Vercel.

  ## Quickstart
  Installs neccesary packages
  ```
  yarn install
  ```

  Starts up a local blockchain
  ```
  yarn chain
  ```

  Runs `Deploy.s.sol` on the local blockchain
  ```
  yarn deploy
  ```

  Runs the client-side application on your local machine
  ```
  yarn start
  ```