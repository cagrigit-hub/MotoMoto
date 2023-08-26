import ABIManager from "../../classes/abi-manager/ABIManager";
import payment_abi from "../web3/abi/payment-abi";

const g_abi_manager = new ABIManager();

g_abi_manager.addABI("Payment", payment_abi);

export default g_abi_manager;

