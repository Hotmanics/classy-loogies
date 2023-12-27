import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { ClassyLoogies } from "~~/components/classy-loogies/classy-loogies";

const ClassyLoogiesPage: NextPage = () => {
  return (
    <>
      <MetaHeader title="Classy Loogies" description="Classy Loogies" />
      <div className="grid lg:grid-cols-1 flex-grow" data-theme="exampleUi">
        <ClassyLoogies />
      </div>
    </>
  );
};

export default ClassyLoogiesPage;
