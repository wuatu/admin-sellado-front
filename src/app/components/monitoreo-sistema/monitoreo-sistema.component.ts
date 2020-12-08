import { Component, OnInit } from '@angular/core';
import { CalibradorService } from '../../services/calibrador.service';
import { LineaService } from '../../services/linea.service';
import { MonitoreoService } from '../../services/monitoreo.service';
import { MonitoreoSistemaService } from '../../services/monitoreo-sistema.service';
import { RegistroDevService } from '../../services/registro-dev.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { timer,interval, Subscription, Observable } from 'rxjs';
import { RfidEnLineaService } from '../../services/rfid-en-linea.service';
import { LectorEnLineaService } from '../../services/lector-en-linea.service';
import { Linea } from '../../models/linea';



@Component({
  selector: 'app-monitoreo-sistema',
  templateUrl: './monitoreo-sistema.component.html',
  styleUrls: ['./monitoreo-sistema.component.css']
})
export class MonitoreoSistemaComponent implements OnInit {
  closeResult = '';
  calibradores: any = [];
  lineas: any = [];
  turnoActual: any = [];
  collaboratorsInLine: any = [];
  lectorInLine: any = [];
  rfidInLine: any = [];
  collaboratorsInLineAux: any = [];
  lectorInLineAux: any = [];
  rfidInLineAux: any = [];
  currentCollaboratorSelected: any;
  selectedCalibradorText: string = "Seleccionar línea";
  selectedCalibradorObject: any;
  subscriptionTimerTask: Subscription;
  subscriptionTimer: Subscription;
  lastLectorEnLinea:any = [];
  lastRfidEnLinea:any = [];
  bigArray: any = [];
  bigArray2: any = [];
  bigArray3: any = [];

  rfidOutInCaliper: any = [];
  lectorValidatorInCaliper: any = [];
  lastRfidOutInCaliper: any = [];
  lastLectorValidatorInCaliper: any = [];

  bandera:boolean = false;
  bandera2:boolean = false;
  
  rol: number;

  constructor(
    private toastr: ToastrService,
    private calibradorService: CalibradorService,
    private lineaService: LineaService,
    private monitoreoService: MonitoreoService,
    private monitoreoSistemaService: MonitoreoSistemaService,
    private registroDevService: RegistroDevService,
    private modalService: NgbModal,
    private rfidEnLineaService: RfidEnLineaService,
    private lectorEnLineaService: LectorEnLineaService
    ) { }


  ngOnInit() {
    //this.getTurnoActual();
    this.listarCalibradores();

    this.rol = JSON.parse(localStorage.getItem('USER')).rol;

    this.subscriptionTimerTask = timer(0, 7000).subscribe(() => {
      if(this.lineas != null && this.selectedCalibradorObject != null){
        this.getCollaboratorsByLine(this.lineas, this.selectedCalibradorObject.id);
        this.getRfidOutByCaliper();
      }
    });
    
  }

  ngOnDestroy() {
    if (this.subscriptionTimerTask != null) {
      this.subscriptionTimerTask.unsubscribe();
    }
  }
  
  //Método que obtiene desde la base de datos el turno que se encuentra iniciado
  getTurnoActual(){
    this.monitoreoService.getLastTurno(this.selectedCalibradorObject.id).subscribe(
      res => {
        if(res.status == 200){
          this.turnoActual = res.body;
          
        }else if(res.status == 204){
          this.toastr.info("Por favor iniciar turno ");
        }
        
        
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo-sistema')
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
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component monitoreo-sistema');
        //this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  changeSelectedCalibrador(newSelected: any) {
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    //this.getTurnoActual();
    this.getLineOfCaliper(this.selectedCalibradorObject.id);
    
    
  }

  //Este método obtiene desde la base de datos todas las lineas que tiene el calibrador y ejecuta los métodos paras obtener la producción 
  getLineOfCaliper(id:string){
    this.lineas = []
    this.lineaService.getLineasId(id).subscribe(
      res =>{
        this.lineas = res.body;
        this.getCollaboratorsByLine(this.lineas, this.selectedCalibradorObject.id);
        this.getRfidOutByCaliper();
        
      },
      err =>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas, método getLineOfCaliper, component monitoreo-sistema');
      
      }
    )
  }

  getCollaboratorsByLine(lineas: any = [], id:string){
    this.collaboratorsInLine = [];
    let i = 0;
    
    for(let linea of lineas ){
       this.monitoreoSistemaService.getCollaboratorsInLine(linea.id, id, linea.nombre).subscribe(
         res =>{
            if(res.status == 200){
              this.collaboratorsInLine.push(res.body);
            }
            if(i == lineas.length-1){
              this.collaboratorsInLine = this.ordenarArrayCollabordators(this.collaboratorsInLine);
              this.getRfidByLine(this.lineas);
            }
            i++;
        },
        err =>{
          this.registroDevService.creaRegistroDev('No se pudieron obtener los colaboradores en las líneas, método getCollaboratorsByLine, component monitoreo-sistema');
        }
       
      ) 
    }
   
   
  }
  

  

  getRfidByLine(lineas: any = []){
    this.rfidInLine = [];
    let i =0;
    for(let linea of lineas ){
      this.monitoreoSistemaService.getRfidInLine(linea.id).subscribe(
        res =>{
            if(res.status == 200){
              this.rfidInLine.push(res.body);
            }
            if(i == lineas.length-1){
              this.rfidInLine = this.ordenarArray(this.rfidInLine);
              this.getLectorByLine(this.lineas);
              this.getLastRfidEnLinea(this.lineas);
            }
            i++;
        },
        err =>{
          this.registroDevService.creaRegistroDev('No se pudieron obtener rfids de las líneas, método getRfidByLine, component monitoreo-sistema');
        }
       
      )
    }
   
  }
  getLectorByLine(lineas: any = []){
    this.lectorInLine = [];
    let i =0;
    for(let linea of lineas ){
      this.monitoreoSistemaService.getLectorInLine(linea.id).subscribe(
        res =>{
            if(res.status == 200){
              this.lectorInLine.push(res.body);
            }
            if(i == lineas.length-1){
              this.lectorInLine = this.ordenarArray(this.lectorInLine);
            }
            i++;
        },
        err =>{
          this.registroDevService.creaRegistroDev('No se pudieron obtener los lectores de la linea, método getLectorByLine, component monitoreo-sistema');
          
        }
       
      )
    }
   
  }

  getLastRfidEnLinea(lineas: any = []){
    this.lastRfidEnLinea = [];
    let i = 0;
    for(let linea of this.lineas){
      this.rfidEnLineaService.getRfidEnLinea(linea.id).subscribe(
        res => {
          this.lastRfidEnLinea.push(res.body);   
          if(i == lineas.length-1){
            this.lastRfidEnLinea = this.ordenarArray(this.lastRfidEnLinea);
            this.getLastLectorEnLinea(this.lineas);
          }
          i++;  
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener la última lectura del rfid en la línea, método getLastRfidEnLinea, component monitoreo-sistema')
        }
      )
    }
  }

  async getLastLectorEnLinea(lineas: any = []){
    this.lastLectorEnLinea = [];
    let i = 0;
    for(let linea of this.lineas){
      this.lectorEnLineaService.getLectorEnLinea(linea.id).subscribe(
        res => {
          this.lastLectorEnLinea.push(res.body);
          if(i == lineas.length-1){
            this.lastLectorEnLinea = this.ordenarArray(this.lastLectorEnLinea);
            this.joinArrays();
          }
          i++;
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener la última lectura del lector en la línea, método getLastLectorEnLinea, component monitoreo-sistema')
          
        }
      )
    }
  }

  joinArrays(){
    this.bigArray = [];
    let i = 0;
    while(i<this.lineas.length){
      this.bigArray.push({nombre_lector: this.lectorInLine[i].nombre_lector, puerto_lector: this.lectorInLine[i].puerto_lector, baudRate_lector:this.lectorInLine[i].baudRate_lector, codigo_lector: this.lastLectorEnLinea[i].codigo,
        nombre_rfid: this.rfidInLine[i].nombre_rfid, puerto_rfid: this.rfidInLine[i].puerto_rfid, baudRate_rfid:this.rfidInLine[i].baudRate_rfid, codigo_rfid: this.lastRfidEnLinea[i].codigo});
      i++;
    }
    this.joinArrays2();
  }

  joinArrays2(){
    this.bigArray2 = [];
    let i = 0;
    while(i<this.lineas.length){
      this.bigArray2.push([this.collaboratorsInLine[i],this.bigArray[i]]);
      i++;
    }
    this.bandera2 = true;
    
  }
  
  ordenarArray(array: any []){
    let arrayAux: any = [];
    for(let linea of this.lineas){
      
      for(let arr of array){
        if(linea.id == arr[0].id_linea){
          arrayAux.push(arr[0]);
          break;
        }
      }
    }
    return arrayAux;
  }

  ordenarArrayCollabordators(array: any []){
    let arrayAux: any = [];
    for(let linea of this.lineas){
      
      for(let arr of array){
        if(linea.id == arr[0].id_linea){
          arrayAux.push(arr);
          break;
        }
      }
    }
    return arrayAux;
  }


  /*****************************************************************************************/
  getRfidOutByCaliper(){
    this.rfidOutInCaliper = [];
    this.monitoreoSistemaService.getRfidOutInCaliper(this.selectedCalibradorObject.id).subscribe(
      res =>{
          if(res.status == 200){
            this.rfidOutInCaliper = res.body;
            this.getLectorValidatorByCaliper();
          }
      },
      err =>{
        this.registroDevService.creaRegistroDev('No se pudo obtener el rfid de salida del calibrador, método getRfidOutByCaliper, component monitoreo-sistema');
      }
     
    )  
    
  
  }
  getLectorValidatorByCaliper(){
    this.lectorValidatorInCaliper = [];
    this.monitoreoSistemaService.getLectorValidatorInCaliper(this.selectedCalibradorObject.id).subscribe(
      res =>{
          if(res.status == 200){
            this.lectorValidatorInCaliper = res.body;
            this.getLastRfidOutInCaliper();
          }
          
      },
      err =>{
        this.registroDevService.creaRegistroDev('No se pudo obtener el lector validador del calibrador, método getLectorValidatorByCaliper, component monitoreo-sistema');
        
      }
     
    )
      
    
   
  }

  getLastRfidOutInCaliper(){
    this.lastRfidOutInCaliper = [];
    this.monitoreoSistemaService.getLastRfidOutInCaliper(this.selectedCalibradorObject.id).subscribe(
      res => {
        this.lastRfidOutInCaliper = res.body;   
        this.getLastLectorValidatorInCaliper();
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener la ultima lectura del rfid salida del calibrador, método getLastRfidOutInCalipe, component monitoreo-sistema')
        
      }
    )
      
    
  }

  getLastLectorValidatorInCaliper(){
    this.lastLectorValidatorInCaliper = [];
    this.monitoreoSistemaService.getLastLectorInCaliper(this.selectedCalibradorObject.id).subscribe(
      res => {
        this.lastLectorValidatorInCaliper = res.body;
        this.joinArray3();
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener la última lectura del lector validador en el calibrador, método , component monitoreo-sistema')
        
      }
    )
      
    
  }

  joinArray3(){
    this.bigArray3[0] = ({nombre_lector_validador:this.lectorValidatorInCaliper[0].nombre_lector_validador, puerto_lector_validador: this.lectorValidatorInCaliper[0].ip_lector_validador, max_time_wait: this.lectorValidatorInCaliper[0].max_wait_time, ultima_lectura_lector: this.lastLectorValidatorInCaliper[0].codigo_last_lector_validador,
      nombre_rfid_salida:this.rfidOutInCaliper[0].nombre_rfid_salida, puerto_rfid_salida: this.rfidOutInCaliper[0].puerto_rfid_salida, baudRate_rfid_salida: this.rfidOutInCaliper[0].baudRate_rfid_salida, ultima_lectura_rfid: this.lastRfidOutInCaliper[0].codigo_last_rfid_salida});
    this.bandera = true;
  }

  /*****************************************************************************************/
  
}
