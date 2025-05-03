import { Howl } from "howler";
import clickSound from "../assets/sounds/click-sound.mp3"

export const clickSfx = new Howl({
    src: [clickSound],
    volume: 0.5,
})