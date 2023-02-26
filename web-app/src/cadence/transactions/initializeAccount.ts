const initializeAccount = `
    import Dojo from 0xb8564bff2e62329c

    transaction() {
        prepare(signer: AuthAccount) {
          // Store a Dojo.Collection in our account storage.
          signer.save(<- Dojo.createEmptyCollection(), to: /storage/MyCollection)
          
          // Expose Account storage
          signer.link<&Dojo.Collection{Dojo.DojoNFTCollectionPublic}>(/public/MyCollection, target: /storage/MyCollection)
        }
      }
`;

export default initializeAccount;
