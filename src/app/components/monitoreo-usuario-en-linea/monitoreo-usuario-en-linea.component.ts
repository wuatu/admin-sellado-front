import { Component, OnInit } from '@angular/core';
import { CalibradorService } from '../../services/calibrador.service';
import { LineaService } from '../../services/linea.service';
import { MonitoreoService } from '../../services/monitoreo.service';
import { MonitoreoUsuarioEnLineaService } from '../../services/monitoreo-usuario-en-linea.service';
import { RegistroDevService } from '../../services/registro-dev.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { timer,interval, Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-monitoreo-usuario-en-linea',
  templateUrl: './monitoreo-usuario-en-linea.component.html',
  styleUrls: ['./monitoreo-usuario-en-linea.component.css']
})
export class MonitoreoUsuarioEnLineaComponent implements OnInit {
  closeResult = '';
  calibradores: any = [];
  lineas: any = [];
  turnoActual: any = [];
  collaboratorsInLine: any = [];
  collaboratorsInLineAux: any = [];
  currentCollaboratorSelected: any;
  selectedCalibradorText: string = "Seleccionar calibrador";
  selectedCalibradorObject: any;
  subscriptionTimerTask: Subscription;
  subscriptionTimer: Subscription;
  
  constructor(
    private toastr: ToastrService,
    private calibradorService: CalibradorService,
    private lineaService: LineaService,
    private monitoreoService: MonitoreoService,
    private monitoreoUsuarioEnLineaService: MonitoreoUsuarioEnLineaService,
    private registroDevService: RegistroDevService,
    private modalService: NgbModal
    ) { }

  ngOnInit() {
    
    this.getTurnoActual();

    this.subscriptionTimerTask = timer(0, 5000).subscribe(() => {
      console.log("subscriptionTimerTask");
      if(this.lineas != null && this.selectedCalibradorObject != null){
        console.log("dentro del if");
        this.toastr.success('llamada','Operación Satisfactoria')
        this.getCollaboratorsByLine(this.lineas, this.selectedCalibradorObject.id);
      }
    });
    
  }

  ngOnDestroy() {
    if (this.subscriptionTimerTask != null) {
      console.log("te destruyes observable timetask");
      this.subscriptionTimerTask.unsubscribe();
    }
  }
  
  //Método que obtiene desde la base de datos el turno que se encuentra iniciado
  getTurnoActual(){
    this.monitoreoService.getGetLastTurno().subscribe(
      res => {
        this.turnoActual = res.body;
        this.listarCalibradores();
        
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo-calibrador2')
        console.log("el turno no se pudo cargar!");
      }
    )
  }

  //metodo que lista las calibradores
  listarCalibradores(){
    this.calibradorService.getCalibradores().subscribe(
      res=>{
        this.calibradores=res.body;
      },
      err=>{
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component monitoreo-calibrador2');
        //this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  changeSelectedCalibrador(newSelected: any) {
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.getLineOfCaliper(this.selectedCalibradorObject.id);
    
  }

  //Este método obtiene desde la base de datos todas las lineas que tiene el calibrador y ejecuta los métodos paras obtener la producción 
  getLineOfCaliper(id:string){
    this.lineaService.getLineasId(id).subscribe(
      res =>{
        this.lineas = res.body;
        this.getCollaboratorsByLine(this.lineas,id);
      },
      err =>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas, método getLineOfCaliper, component monitoreo-calibrador2');
        console.log("No se pudieron cargar las lineas del calibrador!!!!");
      }
    )
  }


  

  getCollaboratorsByLine(lineas: any = [], id:string){
    this.collaboratorsInLine = [];
    let i =0;
    for(let linea of lineas ){
      this.monitoreoUsuarioEnLineaService.getUsuariosEnLinea(linea.id, id, this.turnoActual[0].id, linea.nombre).subscribe(
        res =>{
            if(res.status == 200){
              this.collaboratorsInLine.push(res.body);
              console.log("carga de colaboradores en las lineas satisfactoria");
            }else if(res.status == 204){
              this.collaboratorsInLine.push(res.body);
              console.log("no hay colaboradores en la linea");
            }
            if(i == lineas.length-1){
              this.ordenarArray()
            }
            i++;
        },
        err =>{
          this.registroDevService.creaRegistroDev('No se pudieron obtener los colaboradores en las líneas, método getLineOfCaliper, component monitoreo-usuario-en-linea');
          
        }
       
      )
    }
   
  }

  ordenarArray(){
    this.collaboratorsInLineAux = [];
    console.log("Ordenar Array");
    for(let linea of this.lineas){
      
      for(let collaborator of this.collaboratorsInLine){
        
        //console.log("linea: "+linea.nombre+" linea: "+ collaborator[0].nombre_linea)
        if(linea.nombre == collaborator[0].nombre_linea){
          this.collaboratorsInLineAux.push(collaborator);
          break;
        }
      }
    }
  }

  onCerrarTurno(collaborator: any, modal) {
    console.log("onCerrarTurno");
    console.log(collaborator)
    console.log("*************************");
    this.currentCollaboratorSelected = collaborator;
    console.log(this.currentCollaboratorSelected);
    this.open(modal);
  }

  closeTurnColaborator(collaborator: any) {
    console.log("Entre a close TurnColaborator");
    let fecha = this.fecha();
    this.monitoreoUsuarioEnLineaService.closeTurnCollaborator(this.turnoActual[0].id, collaborator.id_usuario, collaborator.id_linea, fecha.substring(0, 10), fecha.substring(11, 19)).subscribe(
      res => {
        this.toastr.success('turno cerrado al colaborador','Operación satisfactoria' );
        console.log("turno cerrado al colaborador en la linea anterior");
        this.getCollaboratorsByLine(this.lineas, this.selectedCalibradorObject.id);
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo cerrar el turno del colaborador en la línea que se encontraba, método closeTurnCollaboratorChangeLine, component usuario-en-linea');
        console.log(err);
        console.log("No se pudo cerrar turno en la linea anterior");
      }
    );
  }

   //metodo que abre un modal
   open(modal) {    
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //metodo que sirve para saber la razon por la cual un modal fue cerrado
  private getDismissReason(reason: any): string {
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        console.log("entre al if de reason");
        this.closeTurnColaborator(this.currentCollaboratorSelected);
      }
      return `with: ${reason}`;
    }
  }

  fecha() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    return localISOTime;
  }

}
