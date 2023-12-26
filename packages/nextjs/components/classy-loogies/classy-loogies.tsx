import { useEffect, useState } from "react";
import { ClassyLoogie, IClassyLoogie } from "./classy-loogie";
import { ClassyLoogieAbstracted } from "./classy-loogie-abstracted";
import { CompactPicker } from "react-color";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const ClassyLoogies = () => {
  const { address: account } = useAccount();

  const [color, setColor] = useState("");

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

  const [selectedOption, setSelectedOption] = useState({ value: "0", label: "Warrior" });

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

  console.log(selectedName);
  console.log(selectedClassInformation?.description);
  console.log(selectedOption.value);

  console.log(color);
  const { data: generatedMetadata } = useScaffoldContractRead({
    contractName: "ClassyLoogies",
    functionName: "generateMetadata",
    args: [selectedName, selectedClassInformation?.description, color, BigInt(selectedOption.value)],
  });
  console.log(generatedMetadata);

  const jsonManifestString = Buffer.from(generatedMetadata ? generatedMetadata.substring(29) : "", "base64");
  console.log(jsonManifestString.toString());
  const json = jsonManifestString.toString().length > 0 ? JSON.parse(jsonManifestString.toString()) : "";
  console.log(json);

  return (
    <div className="my-5 flex flex-col items-center">
      <Tabs>
        <TabList>
          <Tab>Creation</Tab>
          <Tab>My Classy Loogies</Tab>
        </TabList>
        <TabPanel>
          <div className="flex flex-col items-center">
            <form
              className="flex flex-col justify-center items-center"
              method="post"
              onSubmit={async (event: any) => {
                event.preventDefault();
                await handleMint(event.target.nameInput.value);
              }}
            >
              <p className="my-1 text-2xl">Create your Classy Loogie!</p>
              <p>Name</p>
              <input
                name="nameInput"
                defaultValue="Alfred"
                onChange={onNameChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p>Class</p>
              <Dropdown
                className=""
                options={options}
                onChange={onSelect}
                value={defaultOption}
                placeholder="Select an option"
              />
              <p>Color</p>
              <CompactPicker
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

            <p className="text-2xl">Preview</p>
            <ClassyLoogieAbstracted
              name={json.name}
              description={json.description}
              image={json.image}
              attributes={json.attributes}
            ></ClassyLoogieAbstracted>
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
