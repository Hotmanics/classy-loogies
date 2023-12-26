import { useState, useEffect } from "react";

import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ClassyLoogie, IClassyLoogie } from "./classy-loogie";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export const ClassyLoogies = () => {
    const { address: account } = useAccount();

    const { writeAsync: mint } = useScaffoldContractWrite({ contractName: "YourCollectible", functionName: "mintItem", args: ["", BigInt(0)], value: parseEther("0.05") });

    const { data: ownerBalance } = useScaffoldContractRead({ contractName: "YourCollectible", functionName: "balanceOf", args: [account] });

    const { data: yourContract } = useScaffoldContract({
        contractName: "YourCollectible",
    });

    const [myTokens, setMyTokens] = useState<IClassyLoogie[]>([]);

    async function getAllOwnedTokens() {
        if (!ownerBalance)
            return;

        const tokens: IClassyLoogie[] = [];

        for (let i = 0; i < ownerBalance; i++) {
            let tokenId = await yourContract?.read.tokenOfOwnerByIndex([account!, BigInt(i)]);
            let tokenURI = await yourContract?.read.tokenURI([BigInt(tokenId!)]);
            tokens.push({
                tokenId,
                tokenURI
            });
        }

        setMyTokens(tokens);
    }

    useEffect(() => {
        getAllOwnedTokens();
    }, [ownerBalance]);

    const myTokensComponents = myTokens.map(myToken => (
        <ClassyLoogie
            tokenId={myToken.tokenId}
            tokenURI={myToken.tokenURI}
            key={myToken.tokenId}
        ></ClassyLoogie>
    ));

    async function handleMint(name: string) {
        await mint({ args: [name, BigInt(+selectedOption.value)] });
    }

    const [selectedOption, setSelectedOption] = useState({ value: "0", label: "Warrior" });

    async function onSelect(option: any) {
        setSelectedOption(option);
    }

    const options = [
        { value: "0", label: 'Warrior' },
        { value: "1", label: 'Wizard' },
        { value: "2", label: 'Archer' },
    ];


    const defaultOption = selectedOption;

    return (
        <div className="flex flex-col items-center">

            <div >
                <form className="flex flex-col justify-center items-center" method="post" onSubmit={async (event: any) => { event.preventDefault(); await handleMint(event.target.name.value) }}>
                    <p className="my-1 text-2xl">Create your Classy Loogie!</p>
                    <p>Name</p>
                    <input name="name" defaultValue="Alfred" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <p>Class</p>
                    <Dropdown className="" options={options} onChange={onSelect} value={defaultOption} placeholder="Select an option" />

                    <button type="submit" className="mx-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">Mint</button>
                    <p className="my-1">*Minting costs at least .05 ether</p>
                </form>
            </div>

            <p className="text-2xl text-center">My Loogies</p>
            <div className="flex">
                {myTokensComponents}
            </div>
        </div>
    )
};
