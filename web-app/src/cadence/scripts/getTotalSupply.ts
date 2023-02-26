const getTotalSupply = `
    import Dojo from 0xb8564bff2e62329c

    pub fun main(): UInt64 {
        return Dojo.totalSupply
    }
`;

export default getTotalSupply;