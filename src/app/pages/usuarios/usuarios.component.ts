import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistro: number = 0;
  cargando: boolean = true;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
          .subscribe ( resp => this.cargarUsuarios());
  }

  mostrarModal( id: string) {
    this.modalUploadService.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {
      this.cargando = true;
      this.usuarioService.cargarUsuarios( this.desde )
          .subscribe ( (resp: any) => {

              this.totalRegistro = resp.total;
              this.usuarios = resp.usuarios;
              this.cargando = false;
      });
  }

  cambiarDesde( valor: number) {

    const desde = this.desde + valor;

    if ( desde >= this.totalRegistro ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino)
    .subscribe( ( usuarios: Usuario[] ) => {
      this.usuarios = usuarios;
      console.log ( this.usuarios );
      this.cargando = false;
    });
  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this.usuarioService.usuario._id ) {
      Swal.fire({
        title: 'Cuidado',
        text: 'No puedes borrar a tu mismo usuario.',
        type: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: 'Borrarás al usuario ' + usuario.nombre ,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.usuarioService.borrarUsuario( usuario._id )
        .subscribe( ()  => this.cargarUsuarios());

        swalWithBootstrapButtons.fire(
          'Eliminado',
          'El usuario ha sido eliminado.',
          'success'
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        return;
      }
    });
  }

  guardarUsuario( usuario: Usuario) {
    this.usuarioService.actualizarUsuario( usuario )
      .subscribe();
  }
}
