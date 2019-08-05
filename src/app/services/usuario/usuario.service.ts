import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { Usuario } from '../../models/usuario.model';

import { URL_SERVICIOS } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
  }

  estaLoguardo() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
      this.menu = JSON.parse( localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify( usuario));
      localStorage.setItem('menu', JSON.stringify(menu));

      this.usuario = usuario;
      this.token = token;
      this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);

  }

  loginGoogle(token: string)  {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token })
        .pipe(map ( ( resp: any ) => {
            this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
            return true;
        }));
  }

  login( usuario: Usuario, recordar: boolean = false) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).pipe(
       map( (resp: any) => {
          this.guardarStorage( resp.id, resp.token, resp.usuario , resp.menu);
          return true;
       })
       , catchError( err => {
              Swal.fire('Error en el login', err.error.message, 'error');
              return throwError(err);
         })
       );
  }

  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario ).pipe(map( (resp: any) => {
      Swal.fire({
        title: 'Usuario creado',
        text: usuario.email,
        type: 'success',
        confirmButtonText: 'Ok'
      });
      return resp.usuario;
    }), catchError( err => {
      Swal.fire(err.error.message, err.error.message, 'error');
      return throwError(err);
       })
    );

  }

  actualizarUsuario( usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario).
      pipe(map ( (resp: any) => {

        if ( usuario._id === this.usuario._id ) {
          const usuarioDB: Usuario = resp.usuario;
          this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
        }

        Swal.fire({
          title: 'Usuario actualizado',
          text: usuario.nombre,
          type: 'success',
          confirmButtonText: 'Ok'
        });

        return true;

      }), catchError( err => {
        Swal.fire(err.error.message, err.error.message, 'error');
        return throwError(err);
      }));
  }

  cambiarImagen( archivo: File, id: string ) {
    this.subirArchivoService.subirArchivo( archivo, 'usuarios', id )
    .then( (resp: any) => {
        this.usuario.img = resp.usuario.img;

        Swal.fire({
          title: 'Imagen actualizado',
          text: this.usuario.nombre,
          type: 'success',
          confirmButtonText: 'Ok'
        });
        this.guardarStorage(id, this.token, this.usuario, this.menu);
    })
    .catch( resp => {
        console.log(resp);
    });
  }

  cargarUsuarios( desde: number = 0 ) {
      let url = URL_SERVICIOS + '/usuario?desde=' + desde;
      return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuario/' + termino;

    return this.http.get( url )
            .pipe(map ( ( resp: any ) => resp.usuario ));
  }

  borrarUsuario( id: string ) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url);
  }
}
