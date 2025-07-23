import SearchBar from "@/components/SearchBar";
import React from "react"
import { searchModels } from "@/lib/modelsApi";
import ModelItem from "@/components/ModelItem";

const ExploreMainPage = async () => {

    return(
        <div className="flex flex-col pt-5 pb-60">
            <SearchBar />
        </div>
        
    )
}
export default ExploreMainPage;