import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr:ToastrService) { }

  showSuccess(title:string, message:string='', duration:number=4000) {
    this.toastr.success(message, title, {
      timeOut: duration
    });
  }

  showWarning(title:string, message:string='', duration:number=4000) {
    this.toastr.warning(message, title, {
      timeOut: duration
    });
  }

  showError(title:string, message:string='', duration:number=4000) {
    this.toastr.error(message, title, {
      timeOut: duration
    });
  }


}
