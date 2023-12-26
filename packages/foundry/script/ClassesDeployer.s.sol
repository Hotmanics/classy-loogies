//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/ClassyLoogies.sol";

contract ClassesDeployer {
    function getClasses()
        external
        pure
        returns (ClassyLoogies.ConstantClassInformation[] memory)
    {
        ClassyLoogies.ConstantClassInformation[]
            memory classes = new ClassyLoogies.ConstantClassInformation[](3);

        classes[0] = ClassyLoogies.ConstantClassInformation(
            "Warrior",
            "A fearless and skilled warrior, forged in the crucible of battle.",
            "Sword",
            84,
            6,
            32,
            '<g id="hat"><path d="M280,200 Q250,20 180,150 Z" fill="#3E3E3E" /></g>',
            '<g id="weapon" transform = "rotate(-45 60 60)"><rect x="20" y="150" width="20" height="150" fill="#B0B0B0" /><rect x="10" y="250" width="40" height="20" fill="black" /></g>'
        );

        classes[1] = ClassyLoogies.ConstantClassInformation(
            "Mage",
            "A wise and mystical wizard, channeling the arcane forces of the universe.",
            "Staff",
            10,
            96,
            22,
            '<g id="hat"><polyline points="200,150 300,100 275,205" style="fill: blue"/></g>',
            '<g id="weapon"><rect x="125" y="75" width="200" height="20"  transform = "rotate(45 60 60)" style="fill:rgb(222,184,135);stroke-width:3;stroke:rgb(0,0,0)" /><ellipse ry="20" rx="20" id="svg_4" cy="125.5" cx="90" stroke-width="3" fill="grey" stroke="#000"/></g>'
        );

        classes[2] = ClassyLoogies.ConstantClassInformation(
            "Archer",
            "A silent sentinel of the woods, the archer's agile form and focused gaze unleash arrows with lethal accuracy.",
            "Bow",
            40,
            17,
            81,
            '<g id="hat"><path d="M280,200 Q250,100 180,150 Z" fill="green" /></g>',
            '<g id="weapon" transform="rotate(210,130,0) translate(-50,-250) scale(.25 0.25)"><path fill="orange" d="M511.531,257.868c0.064-0.64,0.384-1.216,0.384-1.877s-0.32-1.216-0.384-1.877c-0.064-0.747,0.107-1.472-0.021-2.219 c-0.171-0.768-0.64-1.429-0.875-2.176c-0.405-1.28-0.853-2.475-1.493-3.648c-0.32-0.597-0.427-1.301-0.811-1.877v-0.043 l-42.667-64c-6.549-9.792-19.776-12.459-29.589-5.909c-9.813,6.528-12.459,19.776-5.909,29.589l20.544,30.827h-67.712 C366.273,31.159,111.595,0.418,108.929,0.14C97.515-1.204,86.657,7.266,85.377,18.978c-1.301,11.712,7.147,22.251,18.837,23.552 c0.405,0.043,7.317,0.896,18.389,3.072L2.945,245.026c-0.341,0.555-0.469,1.195-0.768,1.771c-0.299,0.619-0.555,1.216-0.789,1.856 c-1.749,4.779-1.749,9.92,0,14.677c0.235,0.64,0.491,1.237,0.789,1.856c0.299,0.597,0.427,1.216,0.768,1.792l119.744,199.573 c-10.261,1.92-17.003,2.752-18.496,2.923c-11.691,1.323-20.117,11.861-18.795,23.573c1.216,10.901,10.432,18.944,21.163,18.944 c0.768,0,1.579-0.043,2.368-0.128c2.667-0.299,257.344-31.04,274.069-234.539h67.712l-20.544,30.827 c-6.549,9.813-3.904,23.061,5.909,29.589c3.648,2.432,7.744,3.584,11.819,3.584c6.891,0,13.653-3.328,17.771-9.493l42.667-64 v-0.021c0.384-0.597,0.491-1.28,0.811-1.899c0.64-1.173,1.088-2.368,1.493-3.648c0.235-0.747,0.704-1.408,0.875-2.176 C511.638,259.34,511.467,258.615,511.531,257.868z M165.761,56.61c66.048,20.629,162.923,69.269,174.272,178.048H58.923 L165.761,56.61z M166.017,455.82L58.923,277.324h281.131C328.854,387.383,232.193,435.596,166.017,455.82z"/></g>'
        );

        return classes;
    }
}
