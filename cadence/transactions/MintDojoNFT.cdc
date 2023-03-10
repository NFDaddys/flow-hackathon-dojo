import Dojo from 0xb33318602009eaf2
transaction(recipient: Address, name: String, description: String, url: String) {

  prepare(signer: AuthAccount) {
    // Get a reference to the `Minter`
    let minter = signer.borrow<&Dojo.Minter>(from: /storage/DojoMinter)
                    ?? panic("This signer is not the one who deployed the contract.")

    // Get a reference to the `recipient`s public Collection
    let recipientsCollection = getAccount(recipient).getCapability(/public/MyCollection)
                                  .borrow<&Dojo.Collection{Dojo.DojoNFTCollectionPublic}>()
                                  ?? panic("The recipient does not have a Collection.")

    // mint the NFT 
    let nft <- minter.createNFT(name: name, description: description, ipfsURI: url)

    // deposit the NFT in the recipient's Collection
    recipientsCollection.deposit(token: <- nft)
  }
}