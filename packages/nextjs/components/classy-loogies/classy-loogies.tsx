import { useEffect, useState } from "react";
import { ClassyLoogie, IClassyLoogie } from "./classy-loogie";
import { ClassyLoogieAbstracted } from "./classy-loogie-abstracted";
import { ColorState, SketchPicker } from "react-color";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

function getAllConstantClasses(allConstantClasses: any, selectedClass: any) {
  if (allConstantClasses === undefined) return;

  const selectedAttributes = [];
  selectedAttributes.push({ name: "Class", value: allConstantClasses[+selectedClass.value].name });
  selectedAttributes.push({ name: "Weapon", value: allConstantClasses[+selectedClass.value].weapon });
  selectedAttributes.push({
    name: "Strength",
    value: allConstantClasses[+selectedClass.value].strength.toString(),
  });
  selectedAttributes.push({
    name: "Spellpower",
    value: allConstantClasses[+selectedClass.value].spellpower.toString(),
  });
  selectedAttributes.push({
    name: "Dexterity",
    value: allConstantClasses[+selectedClass.value].dexterity.toString(),
  });

  return selectedAttributes;
}

const classOptions = [
  { value: "0", label: "Warrior" },
  { value: "1", label: "Wizard" },
  { value: "2", label: "Archer" },
];

export const ClassyLoogies = () => {
  const { address: account } = useAccount();

  // Start: Handle all required client data
  const [selectedName, setSelectedName] = useState("Alfred");
  const [selectedClass, setSelectedClass] = useState(classOptions[0]);
  const [selectedColor, setSelectedColor] = useState("#FFFFF");

  async function onNameInputChanged(event: any) {
    event.preventDefault();
    const target = event.target;

    setSelectedName(target.value);
    console.log(target.value);
  }

  async function onClassDropdownChanged(option: any) {
    setSelectedClass(option);
  }

  async function onColorPickerChanged(color: ColorState) {
    setSelectedColor(color.hex);
  }

  async function handleMint(event: any) {
    event.preventDefault();

    await mint({ args: [event.target.nameInput.value, selectedColor, BigInt(+selectedClass.value)] });
  }

  const { writeAsync: mint } = useScaffoldContractWrite({
    contractName: "ClassyLoogies",
    functionName: "mint",
    args: ["", selectedColor, BigInt(0)],
    value: parseEther("0.05"),
  });

  const { data: ownerBalance } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "balanceOf",
    args: [account],
  });

  const { data: yourContract } = useScaffoldContract({
    contractName: "ClassyLoogies",
  });

  // Start: Grab all info for connected account's tokens and set up components
  const [myTokens, setMyTokens] = useState<IClassyLoogie[]>([]);

  useEffect(() => {
    async function getAllOwnedTokens() {
      if (!ownerBalance) return;
      if (!account) return;

      const tokens: IClassyLoogie[] = [];

      for (let i = 0; i < ownerBalance; i++) {
        const tokenId = await yourContract?.read.tokenOfOwnerByIndex([account, BigInt(i)]);
        const tokenURI = await yourContract?.read.tokenURI([BigInt(tokenId || 0)]);
        tokens.push({
          tokenId,
          tokenURI,
        });
      }

      setMyTokens(tokens);
    }

    getAllOwnedTokens();
  }, [ownerBalance]);

  const [allTokens, setAllTokens] = useState<IClassyLoogie[]>([]);

  useEffect(() => {
    async function getAllTokens() {
      const tokens: IClassyLoogie[] = [];

      const totalSupply = await yourContract?.read.totalSupply();

      for (let i = 0; i < parseInt(totalSupply?.toString() || ""); i++) {
        const tokenURI = await yourContract?.read.tokenURI([BigInt(i || 0)]);
        tokens.push({
          tokenId: BigInt(i),
          tokenURI,
        });
      }

      setAllTokens(tokens);
    }

    getAllTokens();
  }, [ownerBalance]);

  const myTokensComponents = myTokens.map(myToken => (
    <ClassyLoogie tokenId={myToken.tokenId} tokenURI={myToken.tokenURI} key={myToken.tokenId}></ClassyLoogie>
  ));

  const allTokensComponents = allTokens.map(myToken => (
    <ClassyLoogie tokenId={myToken.tokenId} tokenURI={myToken.tokenURI} key={myToken.tokenId}></ClassyLoogie>
  ));

  // Start: Handle all client side rendering possibilities from smart contract and components to view them properly
  // const [attributes, setAttributes] = useState([{ name: "", value: "" }]);

  const { data: allConstantClasses } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "getConstantClassesInformation",
  });

  console.log("Glee");

  const attributes = getAllConstantClasses(allConstantClasses, selectedClass);

  const { data: selectedClassInformation } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "getConstantClassInformation",
    args: [BigInt(selectedClass.value)],
  });

  const { data: svgOne } = useScaffoldContractRead({ contractName: "ClassyLoogies", functionName: "generateEye1" });
  const { data: svgTwo } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "generateHead",
    args: [selectedColor],
  });
  const { data: svgThree } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "generateHat",
    args: [BigInt(selectedClass.value)],
  });
  const { data: svgFour } = useScaffoldContractRead({ contractName: "ClassyLoogies", functionName: "generateEye2" });
  const { data: svgFive } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "generateWeapon",
    args: [BigInt(selectedClass.value)],
  });

  const { data: generatedMetadata } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "generateMetadata",
    args: [
      selectedName,
      selectedClassInformation?.description,
      attributes,
      [svgOne || "", svgTwo || "", svgThree || "", svgFour || "", svgFive || ""],
    ],
  });

  const jsonManifestString = Buffer.from(generatedMetadata ? generatedMetadata.substring(29) : "", "base64");
  const json = jsonManifestString.toString().length > 0 ? JSON.parse(jsonManifestString.toString()) : "";

  return (
    <div className="my-5 flex flex-col items-center">
      <Tabs>
        <TabList>
          <Tab>All Loogies</Tab>
          <Tab>Creation</Tab>
          <Tab>My Classy Loogies</Tab>
        </TabList>
        <TabPanel>
          <p className="text-2xl text-center">All Loogies</p>
          <div className="flex grid grid-cols-3">{allTokensComponents}</div>
        </TabPanel>
        <TabPanel>
          <p className="my-1 text-2xl text-center">Create Your Classy Loogie!</p>
          <div className="flex items-center items-start">
            <form className="flex flex-col justify-center items-center" method="post" onSubmit={handleMint}>
              <p className="my-1 text-2xl">Customization</p>

              <p className="my-1">Name</p>
              <input
                name="nameInput"
                defaultValue="Alfred"
                onChange={onNameInputChanged}
                className="my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p className="my-1">Class</p>
              <Dropdown
                options={classOptions}
                onChange={onClassDropdownChanged}
                value={selectedClass}
                placeholder="Select an option"
              />
              <p className="my-1">Color</p>
              <SketchPicker color={selectedColor} onChangeComplete={onColorPickerChanged} />
              <button
                type="submit"
                className="mx-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
              >
                Mint
              </button>
              <p className="my-1">*Minting costs at least .05 ether</p>
            </form>
            <div className="flex flex-col mx-5">
              <p className="text-center text-2xl">Preview</p>
              <ClassyLoogieAbstracted
                name={json.name}
                description={json.description}
                image={json.image}
                attributes={json.attributes}
              ></ClassyLoogieAbstracted>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <p className="text-2xl text-center">My Classy Loogies</p>
          <div className="flex grid grid-cols-3">{myTokensComponents}</div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
