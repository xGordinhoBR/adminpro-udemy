import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';
import { Subscriber } from 'rxjs';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;

  totalRegistro: number = 0;
  cargando: boolean = true;

  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion
          .subscribe ( () => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospital( this.desde )
      .subscribe( (resp: any) => {
          this.totalRegistro = resp.total;
          this.hospitales = resp.hospitales;
          this.cargando = false;
      });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistro) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  buscarHospital( termino: string ) {
      if ( termino.length <= 0 ) {
        this.cargarHospitales();
        return;
      }

      this.cargando = true;

      this.hospitalService.buscarHospital( termino )
          .subscribe( ( hospitales: Hospital[]) => {
            this.hospitales = hospitales;
            this.cargando = false;
          });
  }

  borrarHospital( hospital: Hospital ) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: 'Borrarás al hospital ' + hospital.nombre ,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.hospitalService.borrarHospital( hospital._id )
        .subscribe( ()  => this.cargarHospitales());

        swalWithBootstrapButtons.fire(
          'Eliminado',
          'El hospital ha sido eliminado.',
          'success'
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        return;
      }
    });
  }

  guardarHospital( hospital: Hospital ) {
    this.hospitalService.actualizarHospital(hospital)
          .subscribe();
  }

  async crearHospital() {

    const {value: valor} = await Swal.fire({
      title: 'Añadir un hospital',
      input: 'text',
      inputPlaceholder: 'Añada un nombre de hospital'
    });
    if ( valor ) {
      Swal.fire('Hospital añadido: ' + valor);
      this.hospitalService.crearHospital( valor )
            .subscribe( () => this.cargarHospitales());
    }
  }

  actualizarImagen( hospital: Hospital ) {
        this.modalUploadService.mostrarModal( 'hospitales', hospital._id);
  }
}
