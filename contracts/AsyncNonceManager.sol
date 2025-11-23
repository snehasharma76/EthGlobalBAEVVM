// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract AsyncNonceManager {
    mapping(address => mapping(uint256 => uint256)) private nonceBitmaps;
    
    event NonceUsed(address indexed user, uint256 nonce);
    
    error NonceAlreadyUsed(address user, uint256 nonce);
    error InvalidNonce(uint256 nonce);
    
    
    function isNonceUsed(address user, uint256 nonce) public view returns (bool) {
        uint256 bitmapIndex = nonce / 256;
        uint256 bitPosition = nonce % 256;
        uint256 bitmap = nonceBitmaps[user][bitmapIndex];
        
        return (bitmap & (1 << bitPosition)) != 0;
    }
    
    
    function _useNonce(uint256 nonce) internal {
        if (isNonceUsed(msg.sender, nonce)) {
            revert NonceAlreadyUsed(msg.sender, nonce);
        }
        
        uint256 bitmapIndex = nonce / 256;
        uint256 bitPosition = nonce % 256;
        
        nonceBitmaps[msg.sender][bitmapIndex] |= (1 << bitPosition);
        
        emit NonceUsed(msg.sender, nonce);
    }
    
    
    function getNextNonce(address user) external view returns (uint256) {
        uint256 bitmapIndex = 0;
        
        while (true) {
            uint256 bitmap = nonceBitmaps[user][bitmapIndex];
            
            if (bitmap != type(uint256).max) {
                for (uint256 i = 0; i < 256; i++) {
                    if ((bitmap & (1 << i)) == 0) {
                        return bitmapIndex * 256 + i;
                    }
                }
            }
            
            bitmapIndex++;
            
            if (bitmapIndex > 1000) {
                break;
            }
        }
        
        return bitmapIndex * 256;
    }
}
