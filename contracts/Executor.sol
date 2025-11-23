// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AsyncNonceManager.sol";

/**
 * @title Executor
 * @notice Batched transaction executor with async nonce support
 * @dev Allows multiple operations to be executed in a single transaction
 */
contract Executor is AsyncNonceManager {
    struct Call {
        address target;
        uint256 value;
        bytes data;
    }
    
    struct ExecutionResult {
        bool success;
        bytes returnData;
    }
    
    event BatchExecuted(address indexed executor, uint256 nonce, uint256 callCount);
    event CallExecuted(address indexed target, uint256 value, bool success);
    
    error ExecutionFailed(uint256 callIndex, bytes reason);
    error InsufficientValue(uint256 required, uint256 provided);
    
    /**
     * @notice Execute a batch of calls with async nonce
     * @param calls Array of calls to execute
     * @param nonce Async nonce for this batch
     * @return results Array of execution results
     */
    function executeBatch(
        Call[] calldata calls,
        uint256 nonce
    ) external payable returns (ExecutionResult[] memory results) {
        _useNonce(nonce);
        
        uint256 totalValue = 0;
        for (uint256 i = 0; i < calls.length; i++) {
            totalValue += calls[i].value;
        }
        
        if (msg.value < totalValue) {
            revert InsufficientValue(totalValue, msg.value);
        }
        
        results = new ExecutionResult[](calls.length);
        
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory returnData) = calls[i].target.call{
                value: calls[i].value
            }(calls[i].data);
            
            results[i] = ExecutionResult({
                success: success,
                returnData: returnData
            });
            
            emit CallExecuted(calls[i].target, calls[i].value, success);
            
            if (!success) {
                revert ExecutionFailed(i, returnData);
            }
        }
        
        emit BatchExecuted(msg.sender, nonce, calls.length);
        
        if (msg.value > totalValue) {
            payable(msg.sender).transfer(msg.value - totalValue);
        }
        
        return results;
    }
    
    /**
     * @notice Execute a single call with async nonce
     * @param target Target contract address
     * @param value ETH value to send
     * @param data Call data
     * @param nonce Async nonce
     * @return success Whether the call succeeded
     * @return returnData Return data from the call
     */
    function executeCall(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 nonce
    ) external payable returns (bool success, bytes memory returnData) {
        _useNonce(nonce);
        
        if (msg.value < value) {
            revert InsufficientValue(value, msg.value);
        }
        
        (success, returnData) = target.call{value: value}(data);
        
        emit CallExecuted(target, value, success);
        
        if (!success) {
            revert ExecutionFailed(0, returnData);
        }
        
        if (msg.value > value) {
            payable(msg.sender).transfer(msg.value - value);
        }
        
        return (success, returnData);
    }
    
    receive() external payable {}
}
