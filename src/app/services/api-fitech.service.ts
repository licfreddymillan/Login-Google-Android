import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
const URL  = environment.url


@Injectable({
  providedIn: 'root'
})
export class ApiFitechService {
  token:string
  constructor(private http:HttpClient) { }
  
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

    if(persona.password.length > 1){
      return new Promise( resolve => {
        const data = {
          email : persona.email,
          password : persona.password
        }
  
        this.http.post(`${URL}/auth/login`,data)
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
          email : persona.email,
          password : persona.email
        }
  
        this.http.post(`${URL}/auth/login`,data)
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
          console.log(resp)
          resolve(true)
        })
    })
  }

  Antecedentefamiliar(persona:any){

    return new Promise( resolve => {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*',
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
          console.log(resp)
        })
    })
  }



}