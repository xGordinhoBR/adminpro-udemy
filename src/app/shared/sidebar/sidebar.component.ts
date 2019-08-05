import { Component, OnInit } from '@angular/core';

// Servicios
import { SidebarService } from '../../services/service.index';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {


  usuario: Usuario;

  constructor(
    public sidebarService: SidebarService,
    public usuarioService: UsuarioService ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
    this.sidebarService.cargarMenu();

  }

}
