import { Suspense, lazy } from "react";
import { Loading } from "../../components/index";

const Products = lazy(() => import("../../features/products/Products"));

const Content = () => {

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Products />
      </Suspense>
    </>
  );
};

export default Content;
