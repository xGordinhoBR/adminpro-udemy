import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificatokenGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) {}

  canActivate(): Promise<boolean> | boolean {

    console.log('Token Guard');

    let token = this.usuarioService.token;
    let payload = JSON.parse( atob( token.split('.')[1] ));

    let expirado = this.expirado( payload.exp);

    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva( fechaExp: number ): Promise<boolean> {
    return new Promise ( (resolve, reject) => {
      const tokenExp = new Date(fechaExp * 1000);
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + (4 * 60 * 60 * 1000));

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        this.usuarioService.renuevaToken()
        .subscribe( () => {
            resolve(true);
          }, () => {
            reject(false);
            this.router.navigate(['/login']);
          });
      }
    });
  }

  expirado( fechaExp: number ) {
    const ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }
  }
  
}
