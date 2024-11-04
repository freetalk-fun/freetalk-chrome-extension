export type Meaning = {
    definition: string;
    pos: string;
  };
  
export type TermData = {
    term: string;
    meanings: Meaning[];
};

export type DictionaryAPIResponse = {
    dailyLimit: number;
    termData?: TermData;
    message?: string
};

export const getMeaning = async (searchWord: string) => {
    try {
        const result = await fetch(`https://api.freetalk.fun/search-term?term=${searchWord}`, {
            method: 'GET',
            headers: {
                "auth-token": "my-secret-token",
            },
        });
        return await result.json();
    } catch (error) {
        console.log(error)
        return;
    }
};

// export const getMeaning = async (searchWord: string) => {
//     try{
//         const result = await fetch(`http://65.2.38.143/flows/trigger/99c028f4-0581-4323-9921-64ecff032d19`, {
//             method: 'POST',
//             headers: {
//                 "Authorization": "Bearer k2bka50PgMWkgTsg_VBpUAD2pUiTQ7Tj",
//                 "Content-Type": "application/json",
//                 "Connection": "keep-alive"
//             },
//             body: JSON.stringify(searchWord)
//         });
//         return await result.json();
//     } catch (error) {
//         console.log(error)
//         return;
//     }
// };

