import React, { useState } from "react";
import { DictionaryAPIResponse, getMeaning } from "../helpers/freeTalkAPI";

function Dictionary() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [dictionaryResponse, setDictionaryResponse] =
    useState<DictionaryAPIResponse>();

  const handleSubmit = async () => {
    try {
      const result = await getMeaning(searchWord);
      console.log(result);
      if(result){
        setDictionaryResponse(result as unknown as DictionaryAPIResponse);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          className="p-1 grow"
          type="text"
          placeholder="Search word"
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyUp={handleKeyPress}
        ></input>
        <button
          className="border border-gray-600 px-3 py-1"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>
      <div className="flex flex-col items-start text-left">
        {dictionaryResponse?.term && (
          <div className="mb-2">
            <div className="font-bold text-base">Term</div>
            <div className="ml-1">{dictionaryResponse.term}</div>
          </div>
        )}
        {dictionaryResponse?.meanings &&
          dictionaryResponse?.meanings.map((meaning) => {
            return (
              <div className="flex flex-col mb-1 ml-1">
                <div className="font-light">{meaning.pos}</div>
                <div className="text-left">{meaning.definition}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dictionary;
