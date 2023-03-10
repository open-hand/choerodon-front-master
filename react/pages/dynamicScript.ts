/* eslint-disable */
// @ts-nocheck
import { useDynamicScript } from "@zknow/utils";
const env: any = window._env_;

export default function loadDynamicScript() {
  const servicesMap = [];
  const microValue = env["MICRO_SERVICE"];
  if (microValue) {
    microValue.split(",")?.forEach((i) => {
      const url = env[i] || `${env["STATIC_URL"]}/${i}`;
      const script = useDynamicScript({
        url: `${url}/importManifest.js`,
      });
      const { ready } = script;
      if (ready) {
        try {
          // const compo = loadComponent(i, `./${i}`);
          const inject = loadComponent(i, "./install");
          // compo();
          inject();
          servicesMap[i] = true;
        } catch (e) {
          console.log(e);
        }
      }
    });
  }

  return servicesMap;
}
