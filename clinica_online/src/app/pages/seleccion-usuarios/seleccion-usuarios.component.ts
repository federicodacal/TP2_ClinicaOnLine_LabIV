import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastService } from 'src/app/services/toast.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-seleccion-usuarios',
  templateUrl: './seleccion-usuarios.component.html',
  styleUrls: ['./seleccion-usuarios.component.css']
})
export class SeleccionUsuariosComponent implements OnInit, OnDestroy {

  icon:string='assets/img/doc.png';
  iconPatient:string='assets/img/patient.png';
  iconSpecialist:string='assets/img/specialist.png';

  logo:string='assets/img/icon.png';
  fechaActual:string='';

  users:any [] = [];

  pacienteSeleccionado:any = null;
  historialClinicoPacienteSeleccionado:any[] = [];

  view:string='seleccion-usuarios';

  loading:boolean = false;

  subscription!:Subscription;
  subscriptionPaciente!:Subscription;

  constructor(private db:DatabaseService, private toast:ToastService) { }

  ngOnInit(): void {

    this.loading = true;

    this.subscription = this.db.getUsers().subscribe((res:any) => {
      this.users = res;
      console.log('users', this.users);

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    if(this.subscriptionPaciente != null) {
      this.subscriptionPaciente.unsubscribe();
    }
  }

  habilitar(uid:string) {
    this.db.updateStatusSpecialist(uid, 'habilitar');
  }

  deshabilitar(uid:string) {
    this.db.updateStatusSpecialist(uid, 'deshabilitar');
  }

  cargarFecha() {
    this.fechaActual = new Date(Date.now()).toDateString();
  }

  cargarPaciente(paciente:any) {

    this.pacienteSeleccionado = paciente;

    this.cargarFecha();

    this.subscriptionPaciente = this.db.getTurnosByPaciente(paciente.uid).subscribe((res:any) => {
      this.historialClinicoPacienteSeleccionado = res.filter((t:any) => t.estado == 'finalizado');

        if(this.historialClinicoPacienteSeleccionado.length > 0) {
          console.log('historial clinico',this.historialClinicoPacienteSeleccionado);
        }
        else {
          console.log('no tiene historial clinico');
        }
    });
  }

  crearPDF() {
    const DATA = document.getElementById('pdf');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`historial_clinico.pdf`);
      });
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_excel' + EXCEL_EXTENSION
    );
  }

  crearExcelUsuarios() {
    this.exportAsExcelFile(this.users, 'usuarios');
  }

  crearExcelUsuarioSeleccionado(user:any) {
    if(user.perfil != 'paciente') {
      this.toast.showWarning('Operación no permitida', 'La descarga del historial de turnos puede realizar en usuarios de perfil paciente.')
    }
    else {
      this.db.getTurnosByPaciente(user.uid).subscribe((res:any) => {
        this.exportAsExcelFile(res, `turnos_${user.lastName}`);
      });
    }
  }

}
