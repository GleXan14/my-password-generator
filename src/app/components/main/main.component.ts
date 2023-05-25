import { AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, from, switchMap, takeUntil, tap, timer } from 'rxjs';
import { EStrength, StrengthMap } from 'src/app/models/password-strength';
import { PasswordConfig } from 'src/app/models/password-config';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  controlsForm: FormGroup;
  characterLength:number = 10;
  characterLengthMax:number = 32;
  slideBackgroundStyle:string;
  strengths:typeof EStrength = EStrength;
  strengthSelected: EStrength = EStrength.GOOD;
  password:string = '';
  copyTooltipText:string = 'Copy';
  isGenerating:boolean = false;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private fb:FormBuilder,
    private passwordService: MainService
  ){}

  ngOnInit(): void {
    this.initializeForm();
    this.changeSliderBackground(this.characterLength);
    this.generatePassword();
  }

  ngAfterViewInit(): void {
    this.controlsForm.get('charLength').valueChanges.pipe(
      tap((value) => {
        this.characterLength = value;
        this.changeSliderBackground(value);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeForm(){
    this.controlsForm = this.fb.group({
      charLength: [10, Validators.required],
      upper:[true],
      lower:[true],
      number:[true],
      symbol:[false]
    });
  }

  changeSliderBackground(value:number){
    const percentValue = ((value*100)/this.characterLengthMax)-2;

    this.slideBackgroundStyle = `linear-gradient(to right, rgb(165,255,175) 0%, rgb(165,255,175) ${percentValue}%, rgb(18,17,22) ${percentValue}%, rgb(18,17,22) 100%)`;
  }

  validateForm(){
    const form = this.controlsForm.value;
    const isValid = form.upper || form.lower || form.number || form.symbol;
    return isValid && !this.isGenerating;
  }

  generatePassword(){
    const formValue = this.controlsForm.value;
    const passwordConfig = new PasswordConfig(formValue);

    const newPassword = this.passwordService.getPassword(passwordConfig);

    this.password = 'Generating...';
    this.isGenerating = true;
    this.strengthSelected = null;

    timer(1000).pipe(
      tap(() => {
        this.password = newPassword;
        this.strengthSelected = passwordConfig.strength;
        this.isGenerating = false;
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();

  }

  getStrengthText():string{
    return StrengthMap[this.strengthSelected];
  }

  copyPassword(){
    from(navigator.clipboard.writeText(this.password)).pipe(
      switchMap(() => {
        this.copyTooltipText = 'Copied!';
        return timer(1000);
      }),
      tap(() =>{
        this.copyTooltipText = 'Copy';
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    
  }

}
