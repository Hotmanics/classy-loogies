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

    function testDeploy() public {
        ClassyLoogies me = new ClassyLoogies(
            new ClassesDeployer().getClasses()
        );

        me.mint{value: 0.5 ether}("Alfred", "#fffff", 0);
    }
}
