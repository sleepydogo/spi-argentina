import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  hasBlankFields(json: any): boolean {
    for (const clave in json) {
      if (json.hasOwnProperty(clave)) {
        const valor = json[clave];

        // Comprobar si el valor es nulo, indefinido o una cadena vacía
        if (
          valor === null ||
          valor === undefined ||
          (typeof valor === 'string' && valor.trim() === '')
        ) {
          return true; // Hay al menos un campo vacío
        }
      }
    }
    return false; // No hay campos vacíos
  }

  validatePhoneNumber(input: string): string {
    return input.replace(/[^0-9+]/g, ''); 
  }

  validateEmail(email: string) {
    // Expresión regular para validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("email", email, emailRegex.test(email))
    return !emailRegex.test(email);
  }

  arePasswordsMatching(password: string, confirmPassword: string) {
    return !(password === confirmPassword);
  }
}
