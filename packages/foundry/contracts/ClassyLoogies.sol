//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "./HexStrings.sol";
import "./ToColor.sol";

contract ClassyLoogies is ERC721Enumerable, Ownable {
    ///////////////////
    // Errors
    ///////////////////
    error ClassyLoogies__NotEnoughEther();
    error ClassyLoogies__NotValidName();
    error ClassyLoogies__NotValidClass();

    ///////////////////
    // Types
    ///////////////////
    using Strings for uint256;
    using HexStrings for uint160;
    using ToColor for bytes3;

    struct CharacterStats {
        bytes3 color;
        string name;
        uint256 class;
    }

    struct ClassStruct {
        string name;
        string description;
        string weapon;
        uint256 strength;
        uint256 spellpower;
        uint256 dexterity;
        string hatSvg;
        string weaponSvg;
    }

    ///////////////////
    // State Variables
    ///////////////////
    mapping(uint256 tokenIds => CharacterStats) private stats;
    ClassStruct[] private constantClassesInformation;

    ///////////////////
    // Events
    ///////////////////
    event MintedItem(address account, uint256 tokenId);

    ///////////////////
    // Functions
    ///////////////////
    constructor(
        ClassStruct[] memory classesInformation
    ) ERC721("Classy Loogies", "CL") Ownable(msg.sender) {
        // RELEASE THE LOOGIES!

        for (uint256 i = 0; i < classesInformation.length; i++) {
            constantClassesInformation.push(classesInformation[i]);
        }
    }

    ///////////////////
    // External Functions
    ///////////////////
    function mint(
        string memory name,
        uint256 classType
    ) external payable returns (uint256 ts) {
        if (msg.value < .05 ether) revert ClassyLoogies__NotEnoughEther();
        if (bytes(name).length <= 0) revert ClassyLoogies__NotValidName();
        if (classType > constantClassesInformation.length)
            revert ClassyLoogies__NotValidClass();

        ts = _mint(name, classType);
    }

    ///////////////////
    // Internal Functions
    ///////////////////
    function _mint(
        string memory name,
        uint256 classType
    ) internal returns (uint256) {
        bytes32 predictableRandom = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                msg.sender,
                address(this)
            )
        );

        stats[totalSupply()].color =
            bytes2(predictableRandom[0]) |
            (bytes2(predictableRandom[1]) >> 8) |
            (bytes3(predictableRandom[2]) >> 16);

        stats[totalSupply()].class = classType;
        stats[totalSupply()].name = name;

        super._mint(msg.sender, totalSupply());
        emit MintedItem(msg.sender, totalSupply());

        return totalSupply();
    }

    ///////////////////
    // Internal & Private View & Pure Functions
    ///////////////////
    function _tokenURI(
        uint256 id
    ) internal view returns (string memory metadata) {
        metadata = _generateMetadataOfToken(id);
        metadata = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(abi.encodePacked(metadata)))
            )
        );
    }

    function _generateMetadataOfToken(
        uint256 id
    ) internal view returns (string memory metadata) {
        string memory name = string(abi.encodePacked(stats[id].name));
        string memory description = string(
            abi.encodePacked(
                constantClassesInformation[stats[id].class].description
            )
        );
        string memory image = Base64.encode(bytes(generateSvgOfToken(id)));

        metadata = string.concat(metadata, '{"name":"');
        metadata = string.concat(metadata, name);
        metadata = string.concat(metadata, '", "description":"');
        metadata = string.concat(metadata, description);
        metadata = string.concat(
            metadata,
            '", "external_url":"https://burnyboys.com/token/'
        );
        metadata = string.concat(metadata, id.toString());
        metadata = string.concat(
            metadata,
            '", "attributes": [{"trait_type": "Class", "value": "'
        );
        metadata = string.concat(
            metadata,
            constantClassesInformation[stats[id].class].name
        );
        metadata = string.concat(
            metadata,
            '"},{"trait_type": "Weapon", "value": "'
        );
        metadata = string.concat(
            metadata,
            constantClassesInformation[stats[id].class].weapon
        );
        metadata = string.concat(
            metadata,
            '"},{"trait_type": "Strength", "value": "'
        );
        metadata = string.concat(
            metadata,
            uint2str(constantClassesInformation[stats[id].class].strength)
        );
        metadata = string.concat(
            metadata,
            '"},{"trait_type": "Spellpower", "value": "'
        );
        metadata = string.concat(
            metadata,
            uint2str(constantClassesInformation[stats[id].class].spellpower)
        );
        metadata = string.concat(
            metadata,
            '"},{"trait_type": "Dexterity", "value": "'
        );
        metadata = string.concat(
            metadata,
            uint2str(constantClassesInformation[stats[id].class].dexterity)
        );
        metadata = string.concat(metadata, '"}], "owner":"');
        metadata = string.concat(
            metadata,
            (uint160(ownerOf(id))).toHexString(20)
        );
        metadata = string.concat(metadata, '", "image": "');
        metadata = string.concat(metadata, "data:image/svg+xml;base64,");
        metadata = string.concat(metadata, image);
        metadata = string.concat(metadata, '"}');
    }

    function generateSvgOfToken(
        uint256 id
    ) internal view returns (string memory) {
        string memory svg = string(
            abi.encodePacked(
                '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
                _renderToken(id),
                "</svg>"
            )
        );

        return svg;
    }

    function _renderToken(
        uint256 id
    ) internal view returns (string memory render) {
        string memory fullComposition = "";

        fullComposition = string.concat(fullComposition, generateEye1());

        fullComposition = string.concat(
            fullComposition,
            generateHead(stats[id].color.toColor())
        );

        fullComposition = string.concat(
            fullComposition,
            generateHat(stats[id].class)
        );

        fullComposition = string.concat(fullComposition, generateEye2());

        fullComposition = string.concat(
            fullComposition,
            generateWeapon(stats[id].class)
        );

        render = string(abi.encodePacked(fullComposition));
    }

    function generateEye1() internal pure returns (string memory component) {
        component = string.concat(component, '<g id="eye1">');
        component = string.concat(
            component,
            '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>'
        );
        component = string.concat(
            component,
            '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>'
        );
        component = string.concat(component, "</g>");
    }

    function generateHead(
        string memory color
    ) internal pure returns (string memory component) {
        component = string.concat(component, '<g id="head">');
        component = string.concat(component, '<ellipse fill="#');
        component = string.concat(component, color);
        component = string.concat(
            component,
            '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="70" ry="51.80065" stroke="#000"/>'
        );
        component = string.concat(component, "</g>");
    }

    function generateHat(
        uint256 classId
    ) internal view returns (string memory component) {
        component = string.concat(
            component,
            constantClassesInformation[classId].hatSvg
        );
    }

    function generateEye2() internal pure returns (string memory component) {
        component = string.concat(component, '<g id="eye2">');
        component = string.concat(
            component,
            '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>'
        );
        component = string.concat(
            component,
            '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>'
        );
        component = string.concat(component, "</g>");
    }

    function generateWeapon(
        uint256 classId
    ) internal view returns (string memory component) {
        component = string.concat(
            component,
            constantClassesInformation[classId].weaponSvg
        );
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

    ///////////////////
    // External & Public View & Pure Functions
    ///////////////////
    function tokenURI(
        uint256 id
    ) public view override returns (string memory metadata) {
        metadata = _tokenURI(id);
    }

    function renderToken(
        uint256 id
    ) public view returns (string memory render) {
        render = _renderToken(id);
    }
}
