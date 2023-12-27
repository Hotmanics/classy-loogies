import { useEffect, useState } from "react";
import { ClassyLoogie, IClassyLoogie } from "./classy-loogie";
import { ClassyLoogieAbstracted } from "./classy-loogie-abstracted";
import { SketchPicker } from "react-color";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const ClassyLoogies = () => {
  const { address: account } = useAccount();

  const [color, setColor] = useState("#FFFFF");
  const [selectedOption, setSelectedOption] = useState({ value: "0", label: "Warrior" });

  const { writeAsync: mint } = useScaffoldContractWrite({
    contractName: "ClassyLoogies",
    functionName: "mint",
    args: ["", color, BigInt(0)],
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

  const [myTokens, setMyTokens] = useState<IClassyLoogie[]>([]);

  async function getAllOwnedTokens() {
    if (!ownerBalance) return;

    const tokens: IClassyLoogie[] = [];

    for (let i = 0; i < ownerBalance; i++) {
      const tokenId = await yourContract?.read.tokenOfOwnerByIndex([account!, BigInt(i)]);
      const tokenURI = await yourContract?.read.tokenURI([BigInt(tokenId!)]);
      tokens.push({
        tokenId,
        tokenURI,
      });
    }

    setMyTokens(tokens);
  }

  useEffect(() => {
    getAllOwnedTokens();
  }, [ownerBalance]);

  const [attributes, setAttributes] = useState([{ name: "", value: "" }]);

  const { data: allConstantClasses } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "getConstantClassesInformation",
  });

  console.log("Hi");
  async function getAllConstantClasses() {
    if (allConstantClasses === undefined) return;

    const selectedAttributes = [];
    selectedAttributes.push({ name: "Class", value: allConstantClasses![+selectedOption.value].name });
    selectedAttributes.push({ name: "Weapon", value: allConstantClasses![+selectedOption.value].weapon });
    selectedAttributes.push({
      name: "Strength",
      value: allConstantClasses![+selectedOption.value].strength.toString(),
    });
    selectedAttributes.push({
      name: "Spellpower",
      value: allConstantClasses![+selectedOption.value].spellpower.toString(),
    });
    selectedAttributes.push({
      name: "Dexterity",
      value: allConstantClasses![+selectedOption.value].dexterity.toString(),
    });

    setAttributes(selectedAttributes);
  }

  useEffect(() => {
    getAllConstantClasses();
  }, [allConstantClasses]);

  const myTokensComponents = myTokens.map(myToken => (
    <ClassyLoogie tokenId={myToken.tokenId} tokenURI={myToken.tokenURI} key={myToken.tokenId}></ClassyLoogie>
  ));

  async function handleMint(name: string) {
    await mint({ args: [name, color, BigInt(+selectedOption.value)] });
  }

  const [selectedName, setSelectedName] = useState("Alfred");

  async function onNameChange(event: any) {
    event.preventDefault();
    const target = event.target;

    setSelectedName(target.value);
    console.log(target.value);
  }

  async function onSelect(option: any) {
    setSelectedOption(option);
  }

  const options = [
    { value: "0", label: "Warrior" },
    { value: "1", label: "Wizard" },
    { value: "2", label: "Archer" },
  ];

  const defaultOption = selectedOption;

  const { data: selectedClassInformation } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "getConstantClassInformation",
    args: [BigInt(selectedOption.value)],
  });

  const { data: generatedMetadata } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "generateMetadata",
    args: [selectedName, selectedClassInformation?.description, color, BigInt(selectedOption.value), attributes],
  });

  const jsonManifestString = Buffer.from(generatedMetadata ? generatedMetadata.substring(29) : "", "base64");
  const json = jsonManifestString.toString().length > 0 ? JSON.parse(jsonManifestString.toString()) : "";

  return (
    <div className="my-5 flex flex-col items-center">
      <Tabs>
        <TabList>
          <Tab>Creation</Tab>
          <Tab>My Classy Loogies</Tab>
        </TabList>
        <TabPanel>
          <p className="my-1 text-2xl text-center">Create Your Classy Loogie!</p>
          <div className="flex items-center items-start">
            <form
              className="flex flex-col justify-center items-center"
              method="post"
              onSubmit={async (event: any) => {
                event.preventDefault();
                await handleMint(event.target.nameInput.value);
              }}
            >
              <p className="my-1 text-2xl">Customization</p>

              <p className="my-1">Name</p>
              <input
                name="nameInput"
                defaultValue="Alfred"
                onChange={onNameChange}
                className="my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p className="my-1">Class</p>
              <Dropdown
                className=""
                options={options}
                onChange={onSelect}
                value={defaultOption}
                placeholder="Select an option"
              />
              <p className="my-1">Color</p>
              <SketchPicker
                color={color}
                onChangeComplete={color => {
                  setColor(color.hex);
                }}
              />
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
          <div className="flex">{myTokensComponents}</div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
