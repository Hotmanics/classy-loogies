// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/ClassyLoogies.sol";
import "../script/ClassesDeployer.s.sol";

contract ClassyLoogiesTest is Test {
    ClassyLoogies public yourContract;

    function setUp() public {
        yourContract = new ClassyLoogies(new ClassesDeployer().getClasses());
    }

    function testMessageOnDeployment() public view {
        // string memory test = yourContract.generateMetadata(
        //     "Jake",
        //     "This is a test.",
        //     "FFFFFF",
        //     0
        // );
        // console.log(test);
    }

    function testSetNewMessage() public {}
}
