import { ClassyLoogieAbstracted } from "./classy-loogie-abstracted";

export interface IClassyLoogie {
  tokenId: bigint | undefined;
  tokenURI: string | undefined;
}

export const ClassyLoogie: React.FC<IClassyLoogie> = props => {
  const jsonManifestString = Buffer.from((props.tokenURI || "").substring(29), "base64");

  const json = JSON.parse(jsonManifestString.toString());

  return (
    <ClassyLoogieAbstracted
      name={json.name}
      description={json.description}
      image={json.image}
      attributes={json.attributes}
    ></ClassyLoogieAbstracted>
  );
};
