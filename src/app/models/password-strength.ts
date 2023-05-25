

export enum EStrength{
    VERYWEAK='very-weak',
    WEAK='weak',
    GOOD='good',
    STRONG='strong'
}

export const StrengthMap:{[key in EStrength]:string} = {
    [EStrength.VERYWEAK]: "VERY WEAK",
    [EStrength.WEAK]: "WEAK",
    [EStrength.GOOD]: "GOOD",
    [EStrength.STRONG]: "STRONG",
}