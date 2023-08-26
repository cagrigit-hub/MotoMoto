// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./CurrencyTransferLib.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import { IPayment } from "./IPayment.sol";

contract Payment is ReentrancyGuard, Pausable, IPayment {
    
    /// @dev %7 fee
    uint256 public DEFAULT_FEE = 700;
    /// @dev 10_000 means = 100%
    uint256 public MAX_BPS = 10_000;

    /// @dev Owner address
    address public owner;


    constructor() ReentrancyGuard() {
        owner = msg.sender;
 
    }   

    receive() external payable {
        emit Track(msg.sender, address(this), msg.value, CurrencyTransferLib.NATIVE_TOKEN);
    }
    fallback() external payable {
        emit Track(msg.sender, address(this), msg.value, CurrencyTransferLib.NATIVE_TOKEN);
    }

    
    function isOwner() public view  {
        if(msg.sender != owner){
            revert OnlyOwner();
        }
    }

    
    function isFee(uint256 fee) public pure  {
        if(fee > 1500){
            revert FeeLimit();
        }
    }
    
    
    function withdraw(address _currency, address _to) external  whenNotPaused nonReentrant {
        isOwner();
        uint256 balance = _currency == CurrencyTransferLib.NATIVE_TOKEN
            ? address(this).balance
            : IERC20(_currency).balanceOf(address(this));

        if(balance == 0){
            revert NoBalance();
        }

        CurrencyTransferLib.transferCurrency(
            _currency,
            address(this),
            _to,
            balance
        );
    }
    
  
    function getFee() public view returns (uint256) {
        return DEFAULT_FEE;
    }

    
    function setFee(uint256 fee) public {
        isOwner();
        isFee(fee);
        DEFAULT_FEE = fee;
    }

    /// @dev Validates that `_addrToCheck` owns and has approved markeplace to transfer the appropriate amount of currency
    function validateERC20BalAndAllowance(
        address _addrToCheck,
        address _currency,
        uint256 _currencyAmountToCheckAgainst
    ) internal view {
        if(_currency == CurrencyTransferLib.NATIVE_TOKEN){
            if(_addrToCheck.balance < _currencyAmountToCheckAgainst){
                revert NoBalance();
            }
            return;
        }
        if(
            IERC20(_currency).balanceOf(_addrToCheck) <
                _currencyAmountToCheckAgainst ||
                IERC20(_currency).allowance(
                    _addrToCheck,
                    address(this)
                ) <
                _currencyAmountToCheckAgainst
        ){
            revert NoBalance();
        }
    }
   
    function pay(
        address _to,
        address _currency,
        uint256 _amount
    ) nonReentrant whenNotPaused external payable {
        validateERC20BalAndAllowance(msg.sender, _currency, _amount);
        uint256 fee = getFee();
        uint256 feeAmount = _amount * fee / MAX_BPS;
        uint256 netAmount = _amount - feeAmount;
        CurrencyTransferLib.transferCurrency(
            _currency,
            msg.sender,
            _to,
            netAmount
        );
        // transfer fee to owner
        CurrencyTransferLib.transferCurrency(
            _currency,
            msg.sender,
            owner,
            feeAmount
        );

        emit PaymentReceived(msg.sender,_to, _currency, _amount, feeAmount, netAmount);

    }
    
   
    function pause() external  whenNotPaused {
        isOwner();
        _pause();
    }

  
    function unpause() external  whenPaused {
        isOwner();
        _unpause();
    }

   
    function changeOwner(address _newOwner) external {
        isOwner();
        address _prevOwner = owner;
        owner = _newOwner;
        emit OwnerChanged(_prevOwner, _newOwner);
    }


}


