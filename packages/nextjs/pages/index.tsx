import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">Classy Loogies</span>
          </h1>
          <p className="text-center text-lg">
            {"These loogies are a little classy...with a medieval style. Customize and mint your entirely onchain Classy Loogie NFT, for 0.05 eth, which uses Base64 encoding and Standard Vector" +
              "Graphics (SVG) to create an NFT Collection where properties and attributes are updated in realtime! Additionally, the frontend allows you to preview your NFT before making the commitment" +
              "onchain so that you can ensure that you've made your perfect Loogie! Feel free to create a loogie and who knows...maybe some evil monsters" +
              "will attack their village some day and you will be called to defend it!"}
          </p>

          <p className="text-center">
            The underlying code has been gas optimized and abstracted to the best of my ability so that you can easily
            fork and expand or create your own version of Classy Loogies!
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
