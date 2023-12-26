import Image from "next/image";

export interface IClassyLoogie {
    tokenId: bigint | undefined;
    tokenURI: string | undefined;
}

export const ClassyLoogie: React.FC<IClassyLoogie> = props => {

    const jsonManifestString = Buffer.from(props.tokenURI!.substring(29), 'base64');
    console.log(jsonManifestString.toString());
    const json = JSON.parse(jsonManifestString.toString());
    console.log(json);

    const myTokensComponents = json.attributes.map((attribute: any, index: number) => (
        <p key={index} className="my-1">{attribute["trait_type"]}: {attribute["value"]}</p>
    ));

    return <div className="w-80 px-5 flex flex-col items-center justify-center bg-black mx-1">
        <Image src={json.image || ""} alt="" width={150} height={100}></Image>
        <p className="text-center">{json.name}</p>
        <p className="my-1 text-center"> {json.description}</p>
        {myTokensComponents}
    </div>;
};
