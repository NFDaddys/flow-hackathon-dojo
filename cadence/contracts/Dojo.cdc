import NonFungibleToken from "./interfaces/NonFungibleToken.cdc" 

pub contract Dojo: NonFungibleToken {
  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)

  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64
    pub let Name: String
    pub let Desciption: String
    pub let ipfsURI: String

    init(_initId: UInt64, _Name: String, _Desciption: String, _ipfsURI: String) {
      self.id = _initId
      self.Name = _Name
      self.Desciption = _Desciption
      self.ipfsURI = _ipfsURI
    }
  }
  pub resource interface DojoNFTCollectionPublic {  
     pub fun deposit(token: @NonFungibleToken.NFT)
     pub fun getIDs(): [UInt64]
     pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
     pub fun borrowDojoNFT(id: UInt64): &NFT
  }  

  pub resource Collection: DojoNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    init() {
      self.ownedNFTs <- {}
    }

    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
      let nft <- self.ownedNFTs.remove(key: withdrawID) 
            ?? panic("This NFT does not exist in this Collection.")
      emit Withdraw(id: nft.id, from: self.owner?.address)
      return <- nft
    }

    pub fun deposit(token: @NonFungibleToken.NFT) {
      let nft <- token as! @NFT
      emit Deposit(id: nft.id, to: self.owner?.address)
      self.ownedNFTs[nft.id] <-! nft
    }

    pub fun getIDs(): [UInt64] {
      return self.ownedNFTs.keys
    }

    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }

    pub fun borrowDojoNFT(id: UInt64): &NFT {
      let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
      return ref as! &NFT
    }

    destroy() {
      destroy self.ownedNFTs
    }
    
  }

  pub fun createEmptyCollection(): @NonFungibleToken.Collection {
    return <- create Collection()
  }

  pub resource Minter {

    pub fun createNFT(ame: String, description: String, ipfsURI: String): @NFT {
      var newDojoNFT <- create NFT(_initId: Dojo.totalSupply, _Name: name, _Desciption: description, _ipfsURI: ipfsURI)
      Dojo.totalSupply = Dojo.totalSupply + UInt64(1)
      return <- newDojoNFT
    }

    pub fun createMinter(): @Minter {
      return <- create Minter()
    }

  }

  init() {
    self.totalSupply = UInt64(1)
    emit ContractInitialized()
    self.account.save(<- create Minter(), to: /storage/DojoMinter)
  }
}