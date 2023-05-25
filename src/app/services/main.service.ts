import { Injectable } from '@angular/core';
import { PasswordConfig } from '../models/password-config';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor() { }

  getPassword(config:PasswordConfig):string{

    const uppercases:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercases:string = 'abcdefghijklmnopqrstuvwxyz';
    const numbers:string = '0123456789';
    const symbols:string = '!@#$%^&*()_+-={}[]:;"<>,.?/';

    let characters:string = '';

    if(config.hasUpper) characters+=uppercases;
    if(config.hasLower) characters+=lowercases;
    if(config.hasNumbers) characters+=numbers;
    if(config.hasSymbols) characters+=symbols;

    let password:string = '';
    for (let x = 0; x < config.charLength; x++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }

}
