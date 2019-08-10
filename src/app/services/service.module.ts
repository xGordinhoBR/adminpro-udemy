import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  LoginGuardGuard,
  SubirArchivoService,
  HospitalService,
  MedicoService,
  AdminGuard,
  VerificatokenGuard
} from './service.index';


import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
      SettingsService,
      SidebarService,
      SharedService,
      UsuarioService,
      SubirArchivoService,
      ModalUploadService,
      HospitalService,
      MedicoService,
      AdminGuard,
      LoginGuardGuard,
      VerificatokenGuard
  ]
})
export class ServiceModule { }
