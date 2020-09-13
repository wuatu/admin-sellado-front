import { Component, OnInit } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  desde: string = "";
  hasta: string = "";
  hoveredDate: NgbDate | null = null;
  turnos: any;
  selectedfromDate: string = "";
  selectedToDate: string = "";

  constructor(
    private authService: AuthService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private turnoService: TurnoService,
    private toastr: ToastrService,) {

      this.fromDate = calendar.getToday();
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-mm-yyyy", 'en-US');
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
     }

  ngOnInit() {
    this.listarTurnos();
  }

  captureDates(){
    const fromYear = this.fromDate.year;
    const fromMonth = this.fromDate.month;
    const fromDay = this.fromDate.day;
    const toYear = this.toDate.year;
    const toMonth = this.toDate.month;
    const toDay = this.toDate.day;

    if((fromMonth>0 && fromMonth<10) && (fromDay>0 && fromDay<10)){
      this.selectedfromDate = fromYear +"-0"+fromMonth+"-0"+fromDay;
    }
    else if(fromMonth>0 && fromMonth<10)
    {
      this.selectedfromDate = fromYear +"-0"+fromMonth+"-"+fromDay;
    }
    else if(fromDay>0 && fromDay<10)
    {
      this.selectedfromDate = fromYear +"-"+fromMonth+"-0"+fromDay;
    }
    else{
      this.selectedfromDate = fromYear +"-"+fromMonth+"-"+fromDay;
    }

    if((toMonth>0 && toMonth<10) && (toDay>0 && toDay<10)){
      this.selectedToDate = toYear+"-0"+ toMonth +"-0"+ toDay;
    }
    else if(toMonth>0 && toMonth<10){
      this.selectedToDate = toYear+"-0"+ toMonth +"-"+ toDay;
    }
    else if(toDay>0 && toDay<10){
      this.selectedToDate = toYear+"-"+ toMonth +"-0"+ toDay;
    }
    else{
      this.selectedToDate = toYear+"-"+ toMonth +"-"+ toDay;
    }
  }

  //metodo que trae todos los registros de lineas desde la base de datos
  listarTurnos() {  
    this.captureDates();
    console.log("this.selectedfromDate: " + this.selectedfromDate);
    console.log("this.selectedToDate: " + this.selectedToDate);
    this.turnoService.getTurnos(this.selectedfromDate, this.selectedToDate).subscribe(
      res => {
        //los registros se almacena en array calibradores que sirve para llenar la tabla de vista lineas
        this.turnos = res;
      },
      err => {
        if (err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar turnos', 'Oops');
        } else{
          this.turnos=null;
        }
      }
    )
  }

  //calendar
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.listarTurnos();      
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.listarTurnos();      
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}
