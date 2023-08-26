// import dotenv
import dotenv from 'dotenv';
dotenv.config();


const envy = {
    port: process.env.PORT || 3000,
    WS_URL: process.env.WSS_URL || "wss://rinkeby.infura.io/ws/v3/6d0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b",
    PAYMENT_CONTRACT_ADDRESS: process.env.PAYMENT_CONTRACT_ADDRESS || "0x2c9b0FEee22D9Be49806f2F63FB03Cfb62e0C83e"
}

export default envy;