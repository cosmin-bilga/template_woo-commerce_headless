import Hero from "../../components/Hero";
import  Categories from "../../components/Categories";
import Avantages from "../../components/Avantages";

export default function Home() {
    return(
        <div className="home">
            <Hero></Hero>
            <Categories></Categories>
            <Avantages></Avantages>
        </div>
    )
}