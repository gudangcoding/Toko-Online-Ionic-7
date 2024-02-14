import { CartService } from 'src/app/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApi } from 'src/provider/RestApi';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Helper } from 'src/provider/Helper';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  profilePhoto =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png';
  user: any ;
  profil: any = [];

  constructor(
    private router:Router,
    private api:RestApi,
    private cartService: CartService,
    public util:Helper
    ) {
  this.user = cartService.getCart('member');
    console.log(this.user.token);
    
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.api.getWithToken('member/profil/'+this.user.id_member,this.user.token).subscribe((res:any)=>{
      console.log(this.user.token);
      console.log('Data Profil : ',res.data);
      this.profil=res.data;
    });
  }

  edit() {
    let body={
      id:this.profil.id_member,
      nama:this.profil.nama,
      alamat:this.profil.alamat,
      telepon:this.profil.telepon,
      email:this.profil.email,
      password_lama:this.profil.password_lama,
      password_baru:this.profil.password_baru,
    }
    this.api.postWithToken(body,'member/update',this.user.token).subscribe((res:any)=>{
        this.util.toastNotif('profil berhasil di update');
    });
  }

  logout() {
    localStorage.removeItem('member');
    this.router.navigateByUrl('login');
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    this.uploadPicture(image.dataUrl);
  }

  uploadPicture(imageData:any) {
    const postData = { id:this.user.id_member,image: imageData };
    this.api.postWithToken(postData,'member/uploadfoto',this.user.token).subscribe((res:any)=>{
      this.util.toastNotif('Foto Berhasil Diupload');
      this.getUser();
    })
  }


}
