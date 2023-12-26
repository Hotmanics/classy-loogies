//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "./HexStrings.sol";
import "./ToColor.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using HexStrings for uint160;
    using ToColor for bytes3;

    uint256 private _tokenIds;

    struct ClassStruct {
        string name;
        string description;
        uint256 strength;
        uint256 spellpower;
        uint256 dexterity;
        string hat;
        string weapon;
    }

    ClassStruct[] classesInformation;

    constructor() ERC721("Classy Loogies", "CL") Ownable(msg.sender) {
        // RELEASE THE LOOGIES!

        classesInformation.push(
            ClassStruct(
                "Warrior",
                "A fearless and skilled warrior, forged in the crucible of battle.",
                84,
                6,
                32,
                '<g id="hat"><path d="M280,200 Q250,20 180,150 Z" fill="#3E3E3E" /></g>',
                '<g id="weapon" transform = "rotate(-45 60 60)"><rect x="20" y="150" width="20" height="150" fill="#B0B0B0" /><rect x="10" y="250" width="40" height="20" fill="black" /></g>'
            )
        );

        classesInformation.push(
            ClassStruct(
                "Mage",
                "A wise and mystical wizard, channeling the arcane forces of the universe.",
                10,
                96,
                22,
                '<g id="hat"><polyline points="200,150 300,100 275,205" style="fill: blue"/></g>',
                '<g id="weapon"><rect x="125" y="75" width="200" height="20"  transform = "rotate(45 60 60)" style="fill:rgb(222,184,135);stroke-width:3;stroke:rgb(0,0,0)" /><ellipse ry="20" rx="20" id="svg_4" cy="125.5" cx="90" stroke-width="3" fill="grey" stroke="#000"/></g>'
            )
        );

        classesInformation.push(
            ClassStruct(
                "Archer",
                "blending precision and agility to unleash deadly arrows with unparalleled accuracy.",
                40,
                17,
                81,
                '<g id="hat"><path d="M280,200 Q250,100 180,150 Z" fill="green" /></g>',
                '<g id="weapon" transform="rotate(210,130,0) translate(-50,-250) scale(.25 0.25)"><path fill="orange" d="M511.531,257.868c0.064-0.64,0.384-1.216,0.384-1.877s-0.32-1.216-0.384-1.877c-0.064-0.747,0.107-1.472-0.021-2.219 c-0.171-0.768-0.64-1.429-0.875-2.176c-0.405-1.28-0.853-2.475-1.493-3.648c-0.32-0.597-0.427-1.301-0.811-1.877v-0.043 l-42.667-64c-6.549-9.792-19.776-12.459-29.589-5.909c-9.813,6.528-12.459,19.776-5.909,29.589l20.544,30.827h-67.712 C366.273,31.159,111.595,0.418,108.929,0.14C97.515-1.204,86.657,7.266,85.377,18.978c-1.301,11.712,7.147,22.251,18.837,23.552 c0.405,0.043,7.317,0.896,18.389,3.072L2.945,245.026c-0.341,0.555-0.469,1.195-0.768,1.771c-0.299,0.619-0.555,1.216-0.789,1.856 c-1.749,4.779-1.749,9.92,0,14.677c0.235,0.64,0.491,1.237,0.789,1.856c0.299,0.597,0.427,1.216,0.768,1.792l119.744,199.573 c-10.261,1.92-17.003,2.752-18.496,2.923c-11.691,1.323-20.117,11.861-18.795,23.573c1.216,10.901,10.432,18.944,21.163,18.944 c0.768,0,1.579-0.043,2.368-0.128c2.667-0.299,257.344-31.04,274.069-234.539h67.712l-20.544,30.827 c-6.549,9.813-3.904,23.061,5.909,29.589c3.648,2.432,7.744,3.584,11.819,3.584c6.891,0,13.653-3.328,17.771-9.493l42.667-64 v-0.021c0.384-0.597,0.491-1.28,0.811-1.899c0.64-1.173,1.088-2.368,1.493-3.648c0.235-0.747,0.704-1.408,0.875-2.176 C511.638,259.34,511.467,258.615,511.531,257.868z M165.761,56.61c66.048,20.629,162.923,69.269,174.272,178.048H58.923 L165.761,56.61z M166.017,455.82L58.923,277.324h281.131C328.854,387.383,232.193,435.596,166.017,455.82z"/></g>'
            )
        );
    }

    // 0 = Warrior
    // 1 = Mage
    // 2 = Archer
    mapping(uint256 => uint256) public class;
    mapping(uint256 => string) public names;
    mapping(uint256 => uint256) public strength;
    mapping(uint256 => uint256) public spellpower;
    mapping(uint256 => uint256) public dexterity;

    mapping(uint256 => bytes3) public color;
    mapping(uint256 => uint256) public chubbiness;

    uint256 mintDeadline = block.timestamp + 24 hours;

    event MintedItem(address account, uint256 tokenId);

    function mintItem(
        string memory name,
        uint256 classType
    ) public payable returns (uint256) {
        require(block.timestamp < mintDeadline, "DONE MINTING");
        require(msg.value >= .05 ether, "Not enough ether!");
        require(bytes(name).length > 0, "You need to give your loogie a name!");
        require(classType < classesInformation.length);

        _tokenIds++;
        _mint(msg.sender, _tokenIds);

        bytes32 predictableRandom = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                msg.sender,
                address(this)
            )
        );

        class[_tokenIds] = classType;
        names[_tokenIds] = name;
        strength[_tokenIds] = classesInformation[classType].strength;
        spellpower[_tokenIds] = classesInformation[classType].spellpower;
        dexterity[_tokenIds] = classesInformation[classType].dexterity;

        color[_tokenIds] =
            bytes2(predictableRandom[0]) |
            (bytes2(predictableRandom[1]) >> 8) |
            (bytes3(predictableRandom[2]) >> 16);
        chubbiness[_tokenIds] =
            35 +
            ((55 * uint256(uint8(predictableRandom[3]))) / 255);

        emit MintedItem(msg.sender, _tokenIds);

        return _tokenIds;
    }

    function addLine(
        string memory text,
        string memory added_text
    ) internal pure returns (string memory) {
        text = string.concat(text, added_text);
        return text;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        string memory name = string(abi.encodePacked(names[id]));

        string memory description = string(
            abi.encodePacked(classesInformation[class[id]].description)
        );

        string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

        string memory md = "";
        md = addLine(md, '{"name":"');
        md = addLine(md, name);
        md = addLine(md, '", "description":"');
        md = addLine(md, description);
        md = addLine(md, '", "external_url":"https://burnyboys.com/token/');
        md = addLine(md, id.toString());
        md = addLine(
            md,
            '", "attributes": [{"trait_type": "Class", "value": "'
        );
        md = addLine(md, classesInformation[class[id]].name);
        md = addLine(md, '"},{"trait_type": "Strength", "value": "');
        md = addLine(md, uint2str(strength[id]));
        md = addLine(md, '"},{"trait_type": "Spellpower", "value": "');
        md = addLine(md, uint2str(spellpower[id]));
        md = addLine(md, '"},{"trait_type": "Dexterity", "value": "');
        md = addLine(md, uint2str(dexterity[id]));
        md = addLine(md, '"}], "owner":"');
        md = addLine(md, (uint160(ownerOf(id))).toHexString(20));
        md = addLine(md, '", "image": "');
        md = addLine(md, "data:image/svg+xml;base64,");
        md = addLine(md, image);
        md = addLine(md, '"}');

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(abi.encodePacked(md)))
                )
            );
    }

    function generateSVGofTokenById(
        uint256 id
    ) internal view returns (string memory) {
        string memory svg = string(
            abi.encodePacked(
                '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
                renderTokenById(id),
                "</svg>"
            )
        );

        return svg;
    }

    // Visibility is `public` to enable it being called by other contracts for composition.
    function renderTokenById(uint256 id) public view returns (string memory) {
        string memory hat;

        hat = classesInformation[class[id]].hat;
        string memory weapon;
        weapon = classesInformation[class[id]].weapon;

        string memory eye1 = "";
        eye1 = addLine(eye1, '<g id="eye1">');
        eye1 = addLine(
            eye1,
            '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>'
        );
        eye1 = addLine(
            eye1,
            '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>'
        );
        eye1 = addLine(eye1, "</g>");

        string memory render = string(
            abi.encodePacked(
                eye1,
                '<g id="head">',
                '<ellipse fill="#',
                color[id].toColor(),
                '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="70" ry="51.80065" stroke="#000"/>',
                "</g>",
                hat,
                '<g id="eye2">',
                '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>',
                '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>',
                "</g>",
                weapon
            )
        );

        return render;
    }

    function uint2str(
        uint _i
    ) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
