import { Suspense, lazy, useEffect, useState, useRef } from "react";
import { Loading } from "../../components/index";
import { useForm, useWatch } from "react-hook-form";


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
