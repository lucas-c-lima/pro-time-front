import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AuthRequest } from 'src/app/models/interface/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}


  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid){
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            const userId = this.userService.getUserIdFromToken(response.token);
            const userProfile = this.userService.getProfileFromToken(response.token);

            this.cookieService.set('USER_TOKEN', response?.token);
            this.cookieService.set('USER_ID', userId?.toString())
            this.cookieService.set('USER_PROFILE', userProfile?.toString())

            this.loginForm.reset();
            this.router.navigate(['/dashboard'])
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: "Login realizado com sucesso!",
              life: 2000
            })
          }
        },
        error: (err) =>{
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: "Erro ao fazer login!",
            life: 2000
          })

          console.log(err)
        }

      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
