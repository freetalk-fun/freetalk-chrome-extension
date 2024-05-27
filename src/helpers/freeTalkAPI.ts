type Meaning = {
  definition: string;
  pos: string;
};

export type DictionaryAPIResponse = {
  term?: string;
  meanings?: Meaning[];
  message?: string;
};

export const getMeaning = async (searchWord: string) => {
    try{
        const result = await fetch(`https://api.freetalk.fun/search-term?term=${searchWord}`, {
            method: 'GET',
            headers: {
                "auth-token": "my-secret-token",
            },
        });
        return await result.json();
    }catch(error){
        console.log(error)
        return;
    }
};
