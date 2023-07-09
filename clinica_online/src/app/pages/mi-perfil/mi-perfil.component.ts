import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  user:any = {};

  logo:string='assets/img/icon.png';

  historialClinicoPaciente:any[] = [];

  view:string='mi-perfil';
  btn:string='MIS HORARIOS';

  fechaActual:string='';

  loading:boolean = false;

  constructor(private auth:AuthService, private db:DatabaseService, private router:Router) { }

  ngOnInit(): void {

    this.loading = true;
    this.auth.userData.subscribe((res:any) => {
      this.user = res;
      console.log('user mi perfil', this.user);

      if(this.user.perfil == 'paciente') {
        this.db.getTurnosByPaciente(this.user.uid).subscribe((res:any) => {
          this.historialClinicoPaciente = res.filter((t:any) => t.estado == 'finalizado');

          console.log('historial clinico',this.historialClinicoPaciente);
        });
      }

      this.loading = false;
    });
  }

  volver() {
    this.router.navigateByUrl('');
  }

  cambiarVista() {
    if(this.view == 'horarios') {
      this.view = 'mi-perfil';
      this.btn = 'MIS HORARIOS';
    }
    else if(this.view == 'mi-perfil') {
      this.view = 'horarios';
      this.btn = 'MI PERFIL';
    }
  }

  /*
  descargarPDF() {
    const data = document.getElementById('pdf');

    //@ts-ignore
    html2canvas(data, {
      type: 'view',
      onrendered: function (canvas:any) {
 
        var imgWidht = 309;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidht /canvas.width;
        var heightLeft = imgHeight;
  
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p','mm','a4');
        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (pdf as any).getImageProperties(contentDataURL);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(
          contentDataURL,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        pdf.save('historial_clinico.pdf');
      }
    });
  }
  */

  cargarFecha() {
    this.fechaActual = new Date(Date.now()).toDateString();
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
}
