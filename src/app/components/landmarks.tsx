import RoyceImg from "@/app/assets/royce-hall.png";
import PowellImg from "@/app/assets/powell.png";
import BruinImg from "@/app/assets/bruin.png";
import JewelImg from "@/app/assets/jewel.png";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export enum LandmarkName {
    Royce = 0,
    Powell,
    BruinBear,
    Jewel,
}
const landmarks = [RoyceImg, PowellImg, BruinImg, JewelImg];
const landmarkNaems = ["Royce Hall", "Powell Library", "Bruin Bear", "Jewel Thais-Williams"];

export async function fetchBase64Image(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
    });
}

export async function startPainting(landmark: LandmarkName, router: AppRouterInstance) {
    const img = await fetchBase64Image(landmarks[landmark].src);
    localStorage.setItem("paintImage", img);
    localStorage.setItem("paintLocation", landmarkNaems[landmark]);
    router.push("/dashboard/paint");
}
