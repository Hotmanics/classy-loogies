import Image from "next/image";

export interface IAttribute {
  trait_type: string;
  value: string;
}

export interface IClassyLoogieAbstracted {
  name: string | undefined;
  description: string | undefined;
  image: string | undefined;
  attributes: IAttribute[] | undefined;
}

export const ClassyLoogieAbstracted: React.FC<IClassyLoogieAbstracted> = props => {
  const myTokensComponents = props.attributes?.map((attribute: any, index: number) => (
    <p key={index} className="my-1">
      {attribute["trait_type"]}: {attribute["value"]}
    </p>
  ));

  return (
    <div className="w-80 px-5 flex flex-col items-center justify-center bg-[#00008B] mx-1">
      <Image src={props.image || ""} alt="" width={150} height={100}></Image>
      <p className="text-center">{props.name}</p>
      <p className="my-1 text-center"> {props.description}</p>
      {myTokensComponents}
    </div>
  );
};
