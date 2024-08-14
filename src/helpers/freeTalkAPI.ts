import { createDirectus, customEndpoint, rest } from "@directus/sdk";
import * as browsers from "webextension-polyfill";
import { DIRECTUS_URL } from "../environment";

type Meaning = {
  definition: string;
  pos: string;
};

export type DictionaryAPIResponse = {
  term?: string;
  meanings?: Meaning[];
  message?: string;
};
const client = createDirectus(DIRECTUS_URL).with(rest());
export const getMeaning = async (searchWord: string) => {
  try {
    // const result = await fetch(`https://api.freetalk.fun/search-term?term=${searchWord}`, {
    //     method: 'GET',
    //     headers: {
    //         "auth-token": "my-secret-token",
    //     },
    // });
    // return await result.json();
    const token = await browsers.storage.local.get("token");
    const result:any = await client.request(() => ({
      path: "flows/trigger/ceb9c30c-ab49-4d7c-be0f-d5afd223c9eb",
      method: "POST",
      headers: {
        "auth-token": `${token.token}`,
      },
      body: JSON.stringify({
        term: searchWord,
      }),
    }));
    console.log(result, "result");
    return await result.json();
  } catch (error) {
    console.log(error);
    return;
  }
};
