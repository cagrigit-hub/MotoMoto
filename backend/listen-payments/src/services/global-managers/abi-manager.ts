import ABIManager from "../../classes/abi-manager/ABIManager";
import payment_abi from "../web3/abi/payment-abi";

const g_abi_manager = new ABIManager();

g_abi_manager.addABI("0x2c9b0feee22d9be49806f2f63fb03cfb62e0c83e", payment_abi);

export default g_abi_manager;

