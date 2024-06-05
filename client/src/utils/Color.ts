
export function parseColor(color: string): number {
    if (!color.startsWith("#")) throw new Error("Invalid color format");
    if (color.length !== 7) throw new Error("Invalid color format");
    return parseInt(color.replace("#", ""), 16);
}

export function colorToString(color: number): string {
    return "#" + color.toString(16).padStart(6, "0");
}
