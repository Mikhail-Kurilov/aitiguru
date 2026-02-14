import { Suspense, lazy } from "react";
import { Loading } from "../../components/index";


const Goods = lazy(() => import("../../components/Goods/Goods"));

const Content = () => {

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Goods />
      </Suspense>
    </>
  );
};

export default Content;
