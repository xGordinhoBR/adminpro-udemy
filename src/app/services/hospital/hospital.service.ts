import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Hospital } from 'src/app/models/hospital.model';

import { URL_SERVICIOS } from '../../config/config';

import { UsuarioService } from '../usuario/usuario.service';


import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;
  hospital: Hospital;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService
    // public subirArchivoService: SubirArchivoService
  ) { }

  cargarHospital( desde: number = 0) {

    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get( url )
      .pipe(map( (resp) => {
        return resp;
      }));
   }

  obtenerHospital( id: string ) {
      let url = URL_SERVICIOS + '/hospital/' + id;
      return this.http.get( url )
          .pipe(map ( (resp: any) => resp.hospital ));
  }

  crearHospital( nombre: string ) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this.usuarioService.token;

    return this.http.post(url, { nombre })
        .pipe(map ( (resp: any) => resp.hospital));
  }

  buscarHospital( termino: string ) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get( url )
          .pipe(map ( ( resp: any ) => resp.hospitales ));
  }

  actualizarHospital( hospital: Hospital ) {
        let url = URL_SERVICIOS + '/hospital/' + hospital._id;
        url += '?token=' + this.usuarioService.token;

        return this.http.put( url, hospital)
            .pipe( map ( ( resp: any ) => {
              Swal.fire({
                title: 'Hospital actualizado',
                text: resp.nombre,
                type: 'success',
                confirmButtonText: 'Ok'
              });
              return resp.hospital;
            }));
  }

  borrarHospital( id: string ) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete(url);
  }
}
