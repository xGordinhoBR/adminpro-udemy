import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Medico } from 'src/app/models/medico.model';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedico: number = 0;


  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService,
  ) { }

  cargarMedicos( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get(url)
          .pipe( map( ( resp: any ) => {
            this.totalMedico = resp.total;
            return resp;
          }));
  }

  cargarMedico( id: string ) {
    let url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get( url )
        .pipe(map ( ( resp: any ) => resp.medico));
  }

  buscarMedico(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get( url )
            .pipe(map ( ( resp: any ) => resp.medicos ));
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete(url).
        pipe(map ( resp => {
          Swal.fire(
            'Eliminado',
            'eliminación con éxito',
            'success'
          );
      }));
  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id) {
      url += '/' + medico._id;
      url += '?token=' + this.usuarioService.token;

      return this.http.put(url, medico)
          .pipe(map (( resp: any ) => {
            Swal.fire(
              'Medico actualizado',
              medico.nombre,
              'success'
            );

            return resp.medico;
          }));
    } else {
      url += '?token=' + this.usuarioService.token;

      return this.http.post( url, medico)
          .pipe(map ( (resp: any) => {
            Swal.fire(
              'Medico creado',
              medico.nombre,
              'success'
            );
            return resp.medico;
          }));
    }
  }

}
