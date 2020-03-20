import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Storage} from '@ionic/storage'
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

const URL  = environment.url


@Injectable({
  providedIn: 'root'
})
export class ApiFitechService {
  token:string = null
  latidocorazon:any
  examenFuerza = {
    resultado:null,
    ejercicio:null,
    resultado_2:null,
    ejercicio_2:null,
    resultado_3:null,
    ejercicio_3:null
  } 

  bloquearexamen = {
    examen1:false,
    examen2:false,
    examen3:false
  }
  
  rutina = {}
  Nuevarutina = {}
  rutinaListadoRemplazar = {}
  rutinaTestCasaHombre = [
    {'name': 'jumping jacks'}, 
    {'name': 'sentadillas'}, 
    {'name': 'push up en rodillas'}, 
    {'name': 'superman'}, 
    {'name': 'skipping alto'}, 
    {'name': 'sentadillas con salto y brazos extendidos'}, 
    {'name': 'pushups'}, 
    {'name': 'plancha palanca larga'}, 
    {'name': 'burpee mas flexion y saltos'}, 
    {'name': 'zancada pliometrica alternada'}, 
    {'name': 'pushups mas flexion de cadera lateral'}, 
    {'name': 'hollows'}, 
    {'name': 'burpees avanzados rodillas al pechos'}, 
    {'name': 'pistols alternados'}, 
    {'name': 'pushups explosivos'}, 
    {'name': 'plancha palanca larga en manos'}
  ]

  rutinaTestCasaMujer = [
    {'name': 'jumping jacks'}, 
    {'name': 'sentadillas'}, 
    {'name': 'push up en rodillas'}, 
    {'name': 'superman'}, 
    {'name': 'skipping alto'}, 
    {'name': 'sentadillas con salto y brazos extendidos'}, 
    {'name': 'pushups apoyo en rodillas'}, 
    {'name': 'plancha palanca larga'}, 
    {'name': 'burpee mas flexion y salto'}, 
    {'name': 'zancada pliometrica alternada'}, 
    {'name': 'pushups'}, 
    {'name': 'hollows'}, 
    {'name': 'burpee avanzados rodillas al pecho'}, 
    {'name': 'pistols con apoyo alternado'}, 
    {'name': 'pushups mas flexion de cadera lateral'}, 
    {'name': 'plancha palanca larga en manos'}
  ]


  usuario:any
  training:any
  IDusuario:any
  IDRutinaUsuario:any
  evaluarTest:boolean 
  contador:number = 0 
  idListadoRemplazar:number
  genero:number

  demostracionEjercicio = {
    nombre: null,
    repeticion:null,
    id:null
  }

  constructor(private http:HttpClient , private storage:Storage) { }
  
  Registrar(persona:any){
    if(persona.password.length > 1) {
      return new Promise( resolve => {
        const data = {
          email : persona.correo,
          password : persona.password,
          password_confirmation:persona.password,
          name : persona.nombre,
          gender : persona.genero,
          age : persona.edad,
          weight : persona.peso,
          stature : persona.estatura,
          objective : persona.objetivo,
          act_physical : persona.nivelActividad,
          training_experience : persona.experiencia,
          training_place : persona.lugarEntrenar,
          hypertension : persona.hipertension,
          hypotension : persona.hipotension,
          lung_diseases : persona.enfermedadPulmonar,
          fading : persona.desvanecimiento,
          diabetes_insulindependent : persona.diabete,
          chest_pains : persona.dolorPecho,
          cardiac_pathologies : persona.patologiaCardiaca,
          unusual_fatigue : persona.fatiga,
          none:persona.noEnfermedad
        }
  
        this.http.post(`${URL}/auth/register`,data)
        .subscribe(resp=>{
            this.token =  resp['access_token']
            console.log(this.token)
            resolve(true)
          },err =>{
            console.log(err)
            resolve(false)
          })
      })
    }else{
      return new Promise( resolve => {
        const data = {
          email : persona.correo,
          password : persona.correo,
          password_confirmation:persona.correo,
          name : persona.nombre,
          gender : persona.genero,
          age : persona.edad,
          weight : persona.peso,
          stature : persona.estatura,
          objective : persona.objetivo,
          act_physical : persona.nivelActividad,
          training_experience : persona.experiencia,
          training_place : persona.lugarEntrenar,
          hypertension : persona.hipertension,
          hypotension : persona.hipotension,
          lung_diseases : persona.enfermedadPulmonar,
          fading : persona.desvanecimiento,
          diabetes_insulindependent : persona.diabete,
          chest_pains : persona.dolorPecho,
          cardiac_pathologies : persona.patologiaCardiaca,
          unusual_fatigue : persona.fatiga,
          none:persona.noEnfermedad
        }
  
        this.http.post(`${URL}/auth/register`,data)
        .subscribe(resp=>{
            this.token =  resp['access_token']
            console.log(this.token)
            resolve(true)
          },err =>{
            console.log(err)
            resolve(false)
          })
      })
    }

  }

  Login(persona:any){
    
      return new Promise( resolve => {
        const data = {
          email : persona.email,
          password : persona.password
        }
  
        this.http.post(`${URL}/auth/login`,data)
        .subscribe(resp=>{
            //this.token =  resp['access_token']
            this.guardarToken(resp['access_token'])
            this.guardarUsuario(resp['user'])
            this.guardarexamenFuerza(resp['power_test'])
            this.guardarexamenResistencia(resp['aerobic_test'])

            resolve(true)
          },err =>{
            console.log(err)
            this.token = null
            this.storage.clear()
            resolve(false)
          })
      })

  }

  /* MEMORIA CACHE ALMECENADO */
  async guardarToken(token:string){
    this.token = token;
    await this.storage.set('token',token)
  }

  async guardarUsuario(usuario:string){
    this.training = usuario['training_place']
    this.usuario = usuario['name']
    this.IDusuario = usuario['id']
    await this.storage.set('usuario',usuario)
  }

  async guardarexamenFuerza(fuerza:string){
    await this.storage.set('examenfuerza',fuerza)
  }

  async guardarexamenResistencia(resistencia:string){
    await this.storage.set('examenresistencia',resistencia)
  }

  async ActualizarexamenResistencia(){
    await this.storage.set('examenresistencia',"activado")
  }

  async ActualizarexamenFuerza(){
    await this.storage.set('examenfuerza',"activado")
  }

  /*Extraer de la memoria Cache */
  async cargarToken(){
    this.token = await this.storage.get('token') || null
  }

  cargarNombreUsuario(){
    return this.storage.get('usuario')
  }

  cargarExamenResistencia(){
    return this.storage.get('examenresistencia')
  }

  cargarExamenFuerza(){
    return this.storage.get('examenfuerza')
  }
  
  Latidos(persona:any){
    return new Promise( resolve => {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
      'Content-Type':'application/json',
    })
    
    const data = {
      heart_rate : persona
    }

    this.http.post(`${URL}/auth/heart_rate`,data,{headers})
        .subscribe(resp=>{
          this.latidocorazon = resp['message']
          resolve(true)
        })
    })
  }

  Antecedentefamiliar(persona:any){

    return new Promise( resolve => {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
      'Content-Type':'application/json',
    })
    
    const data = {
      cardiac_arrhythmia : persona.arritmia_corazon,
      heart_attack : persona.ataque_corazon,
      heart_operation : persona.operacion_corazon,
      congenital_heart_disease : persona.enfermedad_corazon,
      early_death : persona.muerte_prematura,
      high_blood_pressure : persona.presion_corazon,
      diabetes : persona.diabete_corazon,
      none : persona.ninguna,
    }

    this.http.post(`${URL}/auth/family_medical_record`,data,{headers})
        .subscribe(resp=>{
          resolve(true)
          console.log(resp)
        },err=>{
          resolve(false)
        })
    })
  }

  cinturacadera(persona:any){
    
    return new Promise( resolve => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type':'application/json',
      })

      const data = {
        min_waist : persona.min_cintura,
        max_waist : persona.max_cintura,
        hip : persona.cadera,
        neck : persona.cuello,
        right_thigh : persona.muslo_derecho,
        left_thigh : persona.muslo_izquierdo,
        right_arm : persona.brazo_derecho,
        left_arm : persona.brazo_izquierdo,
        right_calf : persona.pantorrilla_derecho,
        left_calf : persona.pantorrilla_izquierda,
        torax : persona.pecho,
      }

      this.http.post(`${URL}/auth/measurement_record`,data,{headers})
      .subscribe(resp=>{ 
          console.log(resp)
          resolve(true)
        },err =>{
          console.log(err)
        })
    })

}

  TestResistencia(valor:any){
    return new Promise( resolve => {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type':'application/json',
      })
      
      const data = {
        distance : valor
      }
  
      this.http.post(`${URL}/auth/aerobic_test`,data,{headers})
          .subscribe(resp=>{
            console.log(resp)
            this.ActualizarexamenResistencia()
            resolve(true)
          },err=>{
            resolve(false)
          })

      })
  }

  TestFuerza(){

    return new Promise( resolve => {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type':'application/json',
      })
      
      const data = {
        result_75 : this.examenFuerza.resultado,
        exercise :  this.examenFuerza.ejercicio,
        result_75_2 : this.examenFuerza.resultado_2,
        exercise_2 :  this.examenFuerza.ejercicio_2,
        result_75_3 : this.examenFuerza.resultado_3,
        exercise_3 :  this.examenFuerza.ejercicio_3,
      }
  
      this.http.post(`${URL}/auth/power_test`,data,{headers})
          .subscribe(resp=>{
            console.log(resp)
            this.ActualizarexamenFuerza()
            resolve(true)
          },err=>{
            resolve(false)
          })
      })

  }

  //Metodo para la recolecion del test - no interactua con el servidor. (metodo logico)
  recolectarTestFuerza(fuerza:any , ejercicio:number){

    if(ejercicio === 1){
      this.examenFuerza.resultado = fuerza
      this.examenFuerza.ejercicio = 1
      this.bloquearexamen.examen1 = true
    }

    if(ejercicio === 2){
      this.examenFuerza.resultado_2 = fuerza
      this.examenFuerza.ejercicio_2 = 5
      this.bloquearexamen.examen2 = true
    }

    if(ejercicio === 3){
      this.examenFuerza.resultado_3 = fuerza
      this.examenFuerza.ejercicio_3 = 2
      this.bloquearexamen.examen3 = true

    }

    if(ejercicio === 4){
      this.examenFuerza.resultado_3 = fuerza
      this.examenFuerza.ejercicio_3 = 3
      this.bloquearexamen.examen3 = true

    }

  }

  obtenerRutina(){

    return new Promise( resolve => {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type':'application/json',
      })

      //      this.http.get(`${URL}/auth/routine`,{headers})
      
      this.http.get(`${URL}/auth/routine`,{headers})
          .subscribe(resp=>{
            this.IDRutinaUsuario = resp['routine']
            this.rutina = resp['exercises']
            console.log(resp)
            this._refrescarDatos.next()
            resolve(true)
          },err=>{
            resolve(false)
          })
      })

  }

  private _refrescarDatos = new Subject<void>()

  get refrescarDatos(){
    return this._refrescarDatos
  }


  pruebaRealizada(valor){
    this.evaluarTest = valor
  }


  validarEmail(persona:any){
    return new Promise( resolve => {

    const headers = new HttpHeaders({
      'Content-Type':'application/json',
    })
    
    const data = {
      email : persona
    }

    this.http.post(`${URL}/auth/email-verify`,data,{headers})
        .subscribe(resp=>{
          if(resp["email"]== 1){
            resolve(true)
          }else{
            resolve(false)
          }
        },err=>{
          console.log(err)
        })
    })
  }

  ejerciciodemostrado(nombre,repeticion,id){

    this.demostracionEjercicio.nombre = nombre
    this.demostracionEjercicio.repeticion = repeticion
    this.demostracionEjercicio.id = id
  }  

  asignarNuevoEjercicio(id){
    this.idListadoRemplazar = id
  }


  cambiarEjercicio(){

    return new Promise( resolve => {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type':'application/json',
      })

      //      this.http.get(`${URL}/auth/routine`,{headers})
      
      this.http.get(`${URL}/auth/routine-random/${this.IDusuario}/${this.IDRutinaUsuario}/${this.demostracionEjercicio.id}/1`,{headers})
          .subscribe(resp=>{
            console.log(resp)
            this.Nuevarutina = resp
            resolve(true)
          },err=>{
            resolve(false)
          })
      })

  }

  contadorEjercicio(valor:number){
    this.contador +=valor
  }

  listadoEjercicioRemplazar(){
    return new Promise( resolve => {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type':'application/json',
      })

      //      this.http.get(`${URL}/auth/routine`,{headers})
      
      this.http.get(`${URL}/auth/exercise-available/${this.IDusuario}/${this.IDRutinaUsuario}/1`,{headers})
          .subscribe(resp=>{
            console.log(resp)
            this.rutinaListadoRemplazar = resp
            resolve(true)
          },err=>{
            resolve(false)
          })
      })
  }

  cambiarListadoEjercicio(){

    return new Promise( resolve => {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type':'application/json',
      })

      //      this.http.get(`${URL}/auth/routine`,{headers})
      
      this.http.get(`${URL}/auth/update-exercise/${this.IDRutinaUsuario}/${this.demostracionEjercicio.id}/${this.idListadoRemplazar}`,{headers})
          .subscribe(resp=>{
            console.log(resp)
            this.Nuevarutina = resp
            resolve(true)
          },err=>{
            resolve(false)
          })
      })

  }

  asignarGenero(valor){
    this.genero = valor
  }

}
