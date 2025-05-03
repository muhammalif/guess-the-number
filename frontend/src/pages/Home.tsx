import { SparklesText } from "../components/magicui/sparkles-text";
import { RetroGrid } from "../components/magicui/retro-grid";
import { ShinyButton } from "../components/magicui/shiny-button";
import { clickSfx } from "../utils/clickSfx";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate()

    const handleStartGame = () => {
        clickSfx.play()
        navigate("/game")
    }

    return (
        <div className="relative flex h-screen items-center justify-center px-4">
            <RetroGrid className="absolute inset-0" />
            <div className="relative flex flex-col items-center gap-4 sm:gap-6 text-white">
                <SparklesText text="Guess The Number" className="text-4xl sm:text-6xl font-bold text-black text-center" />
                <ShinyButton onClick={handleStartGame} className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                    Start Game
                </ShinyButton>
            </div>
        </div>
    )
}
