const initializeAccount = `
import Dojo from 0xb33318602009eaf2

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
