import { EStrength } from "./password-strength";


export class PasswordConfig{
    charLength:number;
    hasUpper:boolean;
    hasLower:boolean;
    hasNumbers:boolean;
    hasSymbols:boolean;
    strength:EStrength;

    constructor(data?:any){
        this.charLength = data.charLength ?? 10;
        this.hasUpper = data.upper ?? true;
        this.hasLower = data.lower ?? true;
        this.hasNumbers = data.number ?? true;
        this.hasSymbols = data.symbol ?? false;
        this.setStrength();
        
    }

    private setStrength(){
        let score:number = 0;

        score += this.charLength;
        score += this.hasUpper ? 5 : 0;
        score += this.hasLower ? 5 : 0;
        score += this.hasNumbers ? 5 : 0;
        score += this.hasSymbols ? 10 : 0;

        if(score <= 15){
            this.strength = EStrength.VERYWEAK;
        }else if(score <= 20){
            this.strength = EStrength.WEAK;
        }else if(score <= 30){
            this.strength = EStrength.GOOD;
        }else{
            this.strength = EStrength.STRONG;
        }
    }
}