import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{

    const [input,setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")


    const delayPara = (index, nextWord)=>{
        setTimeout(function (){
            setResultData(prev => prev+nextWord)
        },75*index)
    }

    const newChat = () =>{
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) =>{
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
            setRecentPrompt(prompt)
            response = await run(prompt);
        }
        else{
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await run(input);
        }
        let responseArray = response.split("**");
        let newResponse = "";
        for(let i=0;i<responseArray.length;i++){
            if(i===0 || i%2!==1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>" +responseArray[i]+ "</b>";
            }
        }
        let actualResponse = newResponse.split("*").join("<br/>");
        let newResponseArray = actualResponse.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            let newWord = newResponseArray[i]
            delayPara(i,newWord+" ");
        }
        setLoading(false)
        setInput("")
    }


    const contextValue = {
        onSent,
        prevPrompts,
        setPrevPrompts,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        setInput,
        input,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;