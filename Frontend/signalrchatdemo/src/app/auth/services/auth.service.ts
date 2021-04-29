import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { loginDTO } from '../DTOs/loginDTO';
import { tap} from 'rxjs/operators'
import { tokenResponseDTO } from '../DTOs/tokenResponseDTO';
import { registerDTO } from '../DTOs/registerDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  constructor(private httpClient:HttpClient ) { }
  ngOnDestroy(): void {


    console.log("Destruyendo");
  }

  // getters --
  private _token!:string;
  get token ():string{
    if(!this._token){
      console.log("No esta");
      const token = localStorage.getItem('access_token');
      if(token)
        this._token = token;
      }
    return this._token;

  }
  set token(value:string){
    this._token=value;
    localStorage.setItem('access_token',value);
  }
  private _tokenExpiration!:Date;
  get tokenExpiration():Date{
      if(!this._tokenExpiration){
        const expiration = localStorage.getItem('access_token_expiration');
        if(expiration){
          this._tokenExpiration=new Date(expiration);
        }
      }
      return this._tokenExpiration;
  }

  set tokenExpiration(value:Date)
  {
    localStorage.setItem('access_token_expiration',value.toString());
    this._tokenExpiration = value;
  }

  get isTokenExpired(): boolean {
    return (
      (this.tokenExpiration && new Date() >= this.tokenExpiration) ||
      !this.tokenExpiration
    );
  }
  // --end getters
  baseUrl = environment.baseUrl;


  login(userInfo:loginDTO) : Observable<tokenResponseDTO>
  {
    return this.interceptAuthResponse( this.httpClient.post<tokenResponseDTO>(`${this.baseUrl}api/accounts/login`,userInfo));
  }
  register(userInfo:registerDTO) : Observable<tokenResponseDTO>{
    return this.interceptAuthResponse(this.httpClient.post<tokenResponseDTO>(`${this.baseUrl}api/accounts/register`,userInfo));
  }

  isLoggedIn(){
    return this.token && !this.isTokenExpired;
  }

  private interceptAuthResponse(request: Observable<tokenResponseDTO> ):  Observable<tokenResponseDTO>{

    return request
    .pipe(
      tap(r=>{
        this.proccessTokenResponse(r);
      })
    )

  }

  private proccessTokenResponse(tokenResponseDTO:tokenResponseDTO){
    debugger;
    if(tokenResponseDTO){
      this.tokenExpiration = tokenResponseDTO.expiration;
      this.token = tokenResponseDTO.token;
    }

  }








}
