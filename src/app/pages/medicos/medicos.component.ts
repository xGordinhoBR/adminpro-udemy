import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model'
import { MedicoService } from '../../services/medico/medico.service';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  desde: number = 0;
  totalRegistro: number = 0;

  constructor(
    public medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos(this.desde)
    .subscribe( (resp: any) => {
      this.totalRegistro = resp.total;
      this.medicos = resp.medicos;
    });
  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedico( termino )
          .subscribe( medicos => this.medicos = medicos);
  }

  borrarMedico( medico: Medico) {
    this.medicoService.borrarMedico( medico._id)
          .subscribe( () => this.cargarMedicos() );
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
    this.cargarMedicos();
  }
}
