// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IPayment {
    /// READ FUNCTIONS
    /**
     * @dev Returns fee
     */
    function getFee() external view returns (uint256);

    /**
     * @dev Throws if called by any account other than the owner.
     */
    function isOwner() external view;
    
    /**
     * @dev Throws if fee is greater than 15%
     * @param fee fee in bps
     */
    function isFee(uint256 fee) external pure;
    
    /// OPERATIONALS FUNCTIONS
    /**
     * @dev Pay function
     * @param _to Recipient address
     * @param _currency Currency address
     * @param _amount Amount to pay
    */
    function pay(
        address _to,
        address _currency,
        uint256 _amount
    ) external payable;

    /**
     * @dev Withdraws a given amount of currency.
     * @param _currency Currency address
     * @param _to Recipient address
     */
    function withdraw(address _currency, address _to) external;

    /**
     * @dev Sets fee
     * @param fee fee in bps
     */
    function setFee(uint256 fee) external;

     /**
     * @dev Pauses the contract
     */
    function pause() external;

      /**
     * @dev Unpauses the contract
     */
    function unpause() external;

     /**
     * @dev Change contract owner.
     * @param _newOwner New owner address
     */
    function changeOwner(address _newOwner) external;

    /// Events
    /**
     * @dev Emitted when the payment happens.
     * @param _from payment sender
     * @param _to payment recipient
     * @param _currency currency
     * @param _amount amount
     * @param _feeAmount paidFee
     * @param _netAmount netAmount
     */
    event PaymentReceived(address indexed _from, address indexed _to, address indexed _currency, uint256 _amount, uint256 _feeAmount, uint256 _netAmount);
    /**
     * @dev Emitted when the fee is changed.
     * @param _fee new fee
     */
    event FeeChanged(uint256 _fee);

    /**
     * 
     * @param _from from addr
     * @param _to to addr
     * @param _amount amount
     * @param _currency  curreny
     */
    event Track(address indexed _from, address indexed _to, uint256 _amount, address indexed _currency);
    
    /**
     * @dev Emitted when owner changed
     * @param _prevOwner previous owner
     * @param _newOwner new owner
     */
    event OwnerChanged(address indexed _prevOwner,address indexed _newOwner);
    
    /// Errors
    /**
     * @dev Throws if called by any account other than the owner.
     */
    error OnlyOwner();

    /**
     * @dev Throws if not balance
     */
    error NoBalance();

    /**
     * @dev Throws if fee is greater than 15%
     */
    error FeeLimit();

}