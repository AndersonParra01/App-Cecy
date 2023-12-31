import { AbstractControl, Validators } from '@angular/forms';
import { AuthHttpService } from '@services/core';
import { map } from 'rxjs/operators';

export class CustomValidators {
  static required({ value }: AbstractControl): boolean {
    if (value) return value.hasValidator(Validators.required);
    else return false;
  }

  static passwordMatch(password: string, confirm_password: string) {
    return function (form: AbstractControl) {
      const passwordValue = form.get(password)?.value;
      const confirmPasswordValue = form.get(confirm_password)?.value;

      if (passwordValue === confirmPasswordValue) {
        return null;
      }
      return {
        passwordMismatchError: true,
      };
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password')?.value; // get password from our password form control
    const passwordConfirmation: string = control.get(
      'passwordConfirmation'
    )?.value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== passwordConfirmation) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('passwordConfirmation')?.setErrors({ NoPasswordMatch: true });
    } else {
      control.get('passwordConfirmation')?.setErrors(null);
    }
  }

  static verifyUser(authHttpService: AuthHttpService) {
    return (control: AbstractControl) => {
      const value = control.value;
      return authHttpService.verifyUser(value).pipe(
        map((response) => {
          return response.data === null ? null : { UserNotAvailable: true };
        })
      );
    };
  }

  static verifyEmail(authHttpService: AuthHttpService) {
    return (control: AbstractControl) => {
      const value = control.value;
      return authHttpService.verifyEmail(value).pipe(
        map((response) => {
          return response.data === null ? null : { EmailNotAvailable: true };
        })
      );
    };
  }

  static verifyPhone(authHttpService: AuthHttpService) {
    return (control: AbstractControl) => {
      const value = control.value;
      return authHttpService.verifyPhone(value).pipe(
        map((response) => {
          return response.data === null ? null : { PhoneNotAvailable: true };
        })
      );
    };
  }
}
