import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
  ) {}


  canActivate() {


    if (this.usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.log('bloqueado por el admin guard');
      this.usuarioService.logout();
      return false;
    }

  }

}
